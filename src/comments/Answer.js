const template = document.createElement('template');
template.innerHTML = `
    <style>  
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
    .body {
        white-space: pre-line;
    }
    </style>
    <div class="answer card-body bg-light">
        <div>
            <span class="author"><slot name="author">author</slot></span>
            <span class="createdAt"><slot name="createdAt">createdAt</slot></span>
        </div>
        <div class="body">
            <slot name="body">body</slot>
        </div>
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