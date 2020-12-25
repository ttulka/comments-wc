import Comment from './Comment.js';
import Loading from './Loading.js';
import Pagination from "./Pagination.js";
import LeaveMessage from './LeaveMessage.js';
import CommentsService from './service/CommentsService.js'
import ListenersHolder from '../common/ListenersHolder.js';
import safeText from '../common/safeText.js';
import linkify from '../common/linkify.js';
import markdown from '../common/markdown.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
    :host {
        display: block;
    }
    a {
        color: var(--primary, mediumblue);
        text-decoration: none;
    }
    comments-leave-message {
        margin-bottom: 2em;
    }
    </style>
    <comments-leave-message>Leave a comment</comments-leave-message>
    <div class="comments">
        <div class="container"></div>    
    </div>    
`;
export default class App extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.root.appendChild(template.content.cloneNode(true));

        this.service = new CommentsService(this.getAttribute('service'), this.getAttribute('postId'));

        this.comments = this.root.querySelector('.comments');
        this.commentsContainer = this.comments.querySelector('.container');

        this.leaveMessage = this.root.querySelector('comments-leave-message');

        this.loading = new Loading();

        this.nextCommentsListener = { handle: () => {} };
        this.nextAnswersListeners = [];
        this.pagination = new Pagination('Load more comments...');

        this.comments.appendChild(this.loading);
        this.comments.appendChild(this.pagination);

        this._listeners = new ListenersHolder();
    }

    connectedCallback() {
        this._listeners.addListener(this.leaveMessage, 'leave-message:submit', ({detail}) => this.leaveComment(detail));
        this._listeners.addListener(this.pagination, 'pagination:next', e => this.nextCommentsListener.handle());
        this.loadComments();
    }

    disconnectedCallback() {
        this._listeners.removeAllListeners();
    }

    loadComments(next) {
        this.pagination.hide();
        this.loading.show();
        this.service.loadComments(next)
                .then(formatComments)
                .then(data => {
                    data.comments.forEach(d => this.showComment(d, false));
                    if (data.next) {
                        this.pagination.show();
                        this.nextCommentsListener.handle = () => this.loadComments(data.next);
                    }
                })
                .finally(() => this.loading.hide());
    }

    showComment(data, first = false) {
        const comment = new Comment();
        comment.innerHTML = `
            <span slot="author">${safeText(data.author)}</span>
            <span slot="createdAt">${safeText(data.createdAt)}</span>
            <span slot="body">${linkify(markdown(safeText(data.body)))}</span>
        `;
        this._listeners.addListener(comment, 'comment:leave-answer', ({detail}) => this.leaveAnswer(data.id, detail, comment));

        if (data.answers) {
            data.answers.forEach(a => comment.showAnswer(a));
        }
        if (data.next) {
            const nextAnswersListeners = e => this.loadAnswers(comment, data.next);
            this.nextAnswersListeners[comment.id] = { handle: nextAnswersListeners};
            this._listeners.addListener(comment, 'comment:next-answers', e => this.nextAnswersListeners[comment.id].handle());

            comment.showPagination();
        } else {
            comment.hidePagination();
        }
        if (first) {
            this.commentsContainer.insertBefore(comment, this.commentsContainer.firstChild)
        } else {
            this.commentsContainer.appendChild(comment);
        }
    }

    loadAnswers(comment, next) {
        comment.hidePagination();
        comment.showLoading();
        this.service.loadAnswers(next)
                .then(formatAnswers)
                .then(data => {
                    data.answers.forEach(a => comment.showAnswer(a));
                    if (data.next) {
                        this.nextAnswersListeners[comment.id].handle = () => this.loadAnswers(comment, data.next);
                        comment.showPagination();
                    }
                })
                .finally(() => comment.hideLoading());
    }

    leaveComment({name, message}) {
        this.service.saveComment({name, message})
                .then(formatComment)
                .then(data => this.showComment(data, true));
    }

    leaveAnswer(commentId, {name, message}, comment) {
        this.service.saveAnswer(commentId, {name, message})
                .then(formatComment)
                .then(a => comment.showAnswer(a));
    }
}
customElements.define('comments-app', App);

function formatComments(data) {
    return ({...data, comments: (data.comments || []).map(formatComment).map(formatAnswers)});
}

function formatComment(comment) {
    return ({...comment, createdAt: formatDate(comment.createdAt)})
}

function formatAnswers(data) {
    return ({...data, answers: (data.answers || []).map(formatComment)});
}

function formatDate(time) {
    return new Date(parseInt(time * 1000)).toLocaleDateString();
}