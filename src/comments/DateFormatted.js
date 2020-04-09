const template = document.createElement('template');
template.innerHTML = `
    <span><slot></slot></span>
`;

export default class DateFormatted extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.root.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const slot = this.shadowRoot.querySelector('slot');
        console.log('DATE VALUE', slot);
    }
}

customElements.define('comments-date', DateFormatted);