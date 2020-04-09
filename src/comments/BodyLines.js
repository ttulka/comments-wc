const template = document.createElement('template');
template.innerHTML = `
    <style>
    :host {
        display: block;        
    }    
    slot {
        white-space: pre-line;
    }
    </style>
    <div><slot></slot></div>
`;

export default class BodyLines extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.root.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const slot = this.shadowRoot.querySelector('slot');
        console.log('BODY VALUE', slot);
    }
}

customElements.define('comments-body-lines', BodyLines);