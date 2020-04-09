import './DateFormatted.js';
import './BodySafe.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>  
    :host {
        display: block;
    }
    .bg-light {
        background-color: var(--light, #f8f9fa);
    }
    .card-body {
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
        padding: 1.25rem;
    }
    .author {
        font-weight: bold;
        padding-right: 1em;
    }
    </style>
    <div class="answer card-body bg-light">
        <div>
            <span class="author"><slot name="author">author</slot></span>
            <commnents-date class="createdAt"><slot name="createdAt">createdAt</slot></commnents-date>
        </div>
        <div class="body"><comments-body><slot name="body">body</slot></comments-body></div>
    </div>
`;

export default class Answer extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.root.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('comments-answer', Answer);