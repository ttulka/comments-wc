const template = document.createElement('template');
template.innerHTML = `
    <style> 
    :host() {
        display: none;
    }
    .loading {
        height: 3em;
        background-image: url("/assets/img/loading.gif");
        background-repeat: no-repeat;
        background-size: 2em 2em;
        background-position: center;
    }
    </style>
    <div class="loading"></div>
`;

export default class Loading extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.root.appendChild(template.content.cloneNode(true));

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }

    connectedCallback() {
        if (this.getAttribute('hide')) {
            this.hide();
        }
    }

    show() {
        this.style.display = 'block';
    }

    hide() {
        this.style.display = 'none';
    }
}

customElements.define('comments-loading', Loading);