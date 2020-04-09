import CommentsService from './service/CommentsService.js'
import Comment from './Comment.js';
import Loading from './Loading.js';
import Pagination from "./Pagination.js";

const template = document.createElement('template');
template.innerHTML = `
    <div class="comments">
        <div class="container"></div>    
    </div>    
`;

export default class App extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.root.appendChild(template.content.cloneNode(true));

        this.service = new CommentsService(this.getAttribute('service'));

        this.comments = this.root.querySelector('.comments');
        this.commentsContainer = this.comments.querySelector('.container');
        this.loading = new Loading();

        this.nextCommentsListener = { handle: () => {} };
        this.nextAnswersListeners = [];
        this.pagination = new Pagination('Load more comments...');
        this.pagination.addEventListener('pagination:next', () => this.nextCommentsListener.handle());

        this.comments.appendChild(this.loading);
        this.comments.appendChild(this.pagination);

        this.loadComments = this.loadComments.bind(this);
        this.showComment = this.showComment.bind(this);
        this.loadAnswers = this.loadAnswers.bind(this);
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
        const comment = new Comment(data.next);
        comment.innerHTML = `
            <span slot="author">${data.author}</span>
            <span slot="createdAt">${data.createdAt}</span>
            <span slot="body">${data.body}</span>
        `;
        (data.answers || []).forEach(comment.showAnswer);

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
}

customElements.define('comments-app', App);