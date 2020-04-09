const template = document.createElement('template');
template.innerHTML = `
    <style>  
    a {
        color: var(--primary, darkblue);
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

        const link = this.root.querySelector('a');
        link.innerText = label;
        link.addEventListener('click', e => {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('pagination:next'));
        });

        this.dispatchEvent = this.dispatchEvent.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }

    show() {
        this.style.display = 'block';
    }

    hide() {
        this.style.display = 'none';
    }
}

customElements.define('comments-pagination', Pagination);