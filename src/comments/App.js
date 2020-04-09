import CommentsService from './service/CommentsService.js'
import Comment from './Comment.js';
import Loading from './Loading.js';
import Pagination from "./Pagination.js";
import LeaveMessage from './LeaveMessage.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
    :host {
        display: block;
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

        this.loadComments = this.loadComments.bind(this);
        this.showComment = this.showComment.bind(this);
        this.loadAnswers = this.loadAnswers.bind(this);
        this.leaveComment = this.leaveComment.bind(this);
        this.leaveAnswer = this.leaveAnswer.bind(this);

        this.service = new CommentsService(this.getAttribute('service'));

        this.comments = this.root.querySelector('.comments');
        this.commentsContainer = this.comments.querySelector('.container');

        this.leaveMessage = this.root.querySelector('comments-leave-message');
        this.leaveMessage.addEventListener('leave-message:submit', ({detail}) => this.leaveComment(detail));

        this.loading = new Loading();

        this.nextCommentsListener = { handle: () => {} };
        this.nextAnswersListeners = [];
        this.pagination = new Pagination('Load more comments...');
        this.pagination.addEventListener('pagination:next', () => this.nextCommentsListener.handle());

        this.comments.appendChild(this.loading);
        this.comments.appendChild(this.pagination);
    }

    connectedCallback() {
        this.loadComments();
    }

    loadComments(next) {
        console.log('loadComments:', next);
        this.pagination.hide();
        this.loading.show();
        this.service.loadComments(next)
                .then(data => {
                    data.comments.forEach(this.showComment);
                    if (data.next) {
                        this.pagination.show();
                        this.nextCommentsListener.handle = () => this.loadComments(data.next);
                    }
                })
                .finally(this.loading.hide);
    }

    showComment(data) {
        const comment = new Comment();
        comment.innerHTML = `
            <span slot="author">${data.author}</span>
            <span slot="createdAt">${data.createdAt}</span>
            <span slot="body">${data.body}</span>
        `;
        comment.addEventListener('comment:leave-answer', ({detail}) => this.leaveAnswer(data.id, detail, comment));

        if (data.answers) {
            data.answers.forEach(comment.showAnswer);
        }
        if (data.next) {
            this.nextAnswersListeners[comment.id] = { handle: () => this.loadAnswers(comment, data.next) };
            comment.addEventListener('comment:next-answers', () => this.nextAnswersListeners[comment.id].handle());

            comment.showPagination();
        } else {
            comment.hidePagination();
        }
        this.commentsContainer.appendChild(comment);
    }

    loadAnswers(comment, next) {
        console.log('loadAnswers:', next, comment);
        comment.hidePagination();
        comment.showLoading();
        this.service.loadAnswers(next)
                .then(data => {
                    data.answers.forEach(comment.showAnswer);
                    if (data.next) {
                        console.log('NEXT ANSWERS will be', data.next);
                        this.nextAnswersListeners[comment.id].handle = () => this.loadAnswers(comment, data.next);
                        comment.showPagination();
                    }
                })
                .finally(comment.hideLoading);
    }

    leaveComment({name, message}) {
        console.log('leaveComment:', name, message);
        const createdAt = Math.round(new Date().getTime() / 1000);
        this.showComment({
            author: name,
            createdAt,
            body: message
        });
        this.service.leaveComment({name, message});
    }

    leaveAnswer(commentId, {name, message}, comment) {
        console.log('leaveAnswer:', commentId, name, message);
        const createdAt = Math.round(new Date().getTime() / 1000);
        comment.showAnswer({
            author: name,
            createdAt,
            body: message
        });
        this.service.leaveAnswer(commentId, {name, message});
    }
}

customElements.define('comments-app', App);