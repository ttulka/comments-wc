import Answer from './Answer.js';
import Pagination from './Pagination.js';
import Loading from './Loading.js';
import './BodyLines.js';
import ListenersHolder from '../common/ListenersHolder.js';
import safeText from '../common/safeText.js';
import linkify from '../common/linkify.js';

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
    .author {
        font-weight: bold;
        padding-right: 1em;
    }
    .createdAt {
        font-style: italic;
    }
    .reply {
        float: right;
    }
    .answers {
        border-left: 1em solid lightgray;
    }
    .mb-3 {
        margin-bottom: 1rem!important;
    }
    .card {
        word-wrap: break-word;
        background-color: #fff;
        background-clip: border-box;
        border: 1px solid rgba(0,0,0,.125);
        border-radius: .25rem;
    }
    .card-header {
        padding: .75rem 1.25rem;
        margin-bottom: 0;
        background-color: rgba(0,0,0,.03);
        border-bottom: 1px solid rgba(0,0,0,.125);
    }
    .card-body { 
        padding: 1.25rem;
    }    
    .leave-answer {
        padding: 1em;
        padding-bottom: 0.5em;
    }
    </style>
    <div class="comment card mb-3">
    <div class="card-header">
        <span class="author"><slot name="author">author</slot></span>
        <span class="createdAt"><slot name="createdAt">createdAt</slot></span>
        <a class="reply" href="#">Reply</a>
    </div>
    <div class="body card-body">
        <comments-body-lines><slot name="body">body</slot></comments-body-lines>
    </div>
    <div class="answers">
        <div class="container"></div>
        <div class="navigation"></div>
        <div class="leave-answer" style="display: none">
            <comments-leave-message>Your answer</comments-leave-message>
        </div>
    </div>
`;
export default class Comment extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.root.appendChild(template.content.cloneNode(true));

        this.dispatchEvent = this.dispatchEvent.bind(this);
        this.showAnswer = this.showAnswer.bind(this);
        this.showPagination = this.showPagination.bind(this);
        this.hidePagination = this.hidePagination.bind(this);
        this.showLoading = this.showLoading.bind(this);
        this.hideLoading = this.hideLoading.bind(this);

        const answers = this.root.querySelector('.answers');
        this.answersContainer = answers.querySelector('.container');

        this.loading = new Loading();
        this.loading.setAttribute('hide', 'true');

        this.pagination = new Pagination();
        this.leaveAnswer = answers.querySelector('comments-leave-message');
        this.leaveAnswerDiv = answers.querySelector('.leave-answer');
        this.reply = this.root.querySelector('.reply');

        const answersNavigation = answers.querySelector('.navigation');
        answersNavigation.appendChild(this.loading);
        answersNavigation.appendChild(this.pagination);

        this._listeners = new ListenersHolder();
    }

    connectedCallback() {
        this._listeners.addListener(this.pagination, 'pagination:next', e => this.dispatchEvent(new CustomEvent('comment:next-answers')));
        this._listeners.addListener(this.leaveAnswer, 'leave-message:submit', e => this.dispatchEvent(new CustomEvent('comment:leave-answer', e)));
        this._listeners.addListener(this.reply, 'click', e => {
            e.preventDefault();
            this.leaveAnswerDiv.style.display = 'block';
            this.leaveAnswer.focus();
        });
    }

    disconnectedCallback() {
        this._listeners.removeAllListeners();
    }

    showAnswer(data) {
        const answer = new Answer();
        answer.innerHTML = `
            <span slot="author">${safeText(data.author)}</span>
            <span slot="createdAt">${safeText(data.createdAt)}</span>
            <span slot="body">${linkify(safeText(data.body))}</span>
        `;
        this.answersContainer.appendChild(answer);
    }

    showPagination() {
        this.pagination.show();
    }

    hidePagination() {
        this.pagination.hide();
    }

    showLoading() {
        this.loading.show();
    }

    hideLoading() {
        this.loading.hide();
    }
}
customElements.define('comments-comment', Comment);