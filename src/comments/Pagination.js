import ListenersHolder from '../common/ListenersHolder.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>  
    a {
        color: var(--primary, mediumblue);
        text-decoration: none;
    }
    ul {
        margin: 0;
        padding-left: 0;
        list-style: none;
        border-radius: .25rem;
    }
    li {
        padding: .5rem .75rem;
        display: block;
    }
    a {
        border: none;
        border-top-right-radius: .25rem;
        border-bottom-right-radius: .25rem;    
    }
    a:hover {
        background: inherit;
    }
    </style>
    <nav>
        <ul>
            <li>
                <a href="#">...</a>
            </li>
        </ul>
    </nav>
`;
export default class Pagination extends HTMLElement {
    constructor(label = 'Load more...') {
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.root.appendChild(template.content.cloneNode(true));

        this.link = this.root.querySelector('a');
        this.link.innerText = label;

        this._listeners = new ListenersHolder();
    }

    connectedCallback() {
        this._listeners.addListener(this.link,'click', e => {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('pagination:next'));
        });
    }

    disconnectedCallback() {
        this._listeners.removeAllListeners();
    }

    show() {
        this.style.display = 'block';
    }

    hide() {
        this.style.display = 'none';
    }
}
customElements.define('comments-pagination', Pagination);