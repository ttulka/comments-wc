const success_msg_def = 'Thanks for your message!';
const error_msg = 'Server error. Please try it again.';
const captcha_msg = 'Captcha does not match!';

const template = document.createElement('template');
template.innerHTML = `
    <style>
    :host {
        display: block;
    }
    input, textarea {
        display: block;
        width: 100%;
        padding: .375rem 0 .375rem .75rem;
        margin-right: 1em;
        font-size: 1rem;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        border: 1px solid #ced4da;
        border-radius: .25rem;
        transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        box-sizing: border-box;
    }
    input.error , textarea.error {
        border: 1px solid red;
    }
    @media (min-width: 24em) {
        .form-row.flex {
            display: flex;
        }
        .small {
            max-width: 10em;
        }
    }
    textarea {
        overflow: auto;
        resize: vertical;
        margin-right: 20px;
        padding-right: 0;
    }
    button {
        -webkit-appearance: button;
        cursor: pointer;   
        color: #fff;
        background-color: var(--primary, darkblue);
        border-color: var(--primary, darkblue);        
        margin-bottom: .5rem!important;
        display: inline-block;
        font-weight: normal;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        user-select: none;
        border: 1px solid transparent;
        padding: .375rem .75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: .25rem;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }
    form {
        display: block;
    }
    .form-row {
        margin-bottom: 0.5rem;
    }
    .captcha {
        padding-top: 0.2em;
        padding-left: 0.5em;
    }
    .captcha canvas {
        height: 2em;
    }
    .title {
        font-size: 1.5em;
        margin-bottom: 0.5em;
    }
    </style>
    <div class="title"><slot>Leave a comment</slot></div>
    <form method="post">
        <div class="alert error"></div>
        <div class="alert info"></div>
        <div class="form-row flex">
            <div>
                <input name="name" maxLength="50" placeholder="Name"/>
            </div>
        </div>
        <div class="form-row flex">
            <div>
                <input name="captcha" maxLength="10" placeholder="Captcha"/>
            </div>
            <div class="captcha">
                <canvas id="captcha" width="170" height="50"></canvas>
            </div>          
        </div>
        <div class="form-row">
            <div>
                <textarea name="message" rows="5" maxLength="1000"></textarea>
            </div>
        </div>
        <div class="form-row">
            <button type="submit">Submit</button>
        </div>
    </form>
`;

export default class LeaveMessage extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.root.appendChild(template.content.cloneNode(true));

        this.dispatchEvent = this.dispatchEvent.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.focus = this.focus.bind(this);

        const form = this.root.querySelector('form');
        form.addEventListener('submit', e => e.preventDefault() & this.onFormSubmit());

        this.name = form.querySelector('input[name=name]');
        this.captcha = form.querySelector('input[name=captcha]');
        this.message = form.querySelector('textarea[name=message]');
    }

    onFormSubmit() {
        const name = this.name.value.trim();
        const captcha = this.captcha.value.trim();
        const message = this.message.value.trim();

        this.name.classList.remove('error');
        this.captcha.classList.remove('error');
        this.message.classList.remove('error');

        let hasError = false;

        if (!name) {
            this.name.classList.add('error');
            hasError = true;
        }
        if (!captcha) {
            this.captcha.classList.add('error');
            hasError = true;
        }
        if (!message) {
            this.message.classList.add('error');
            hasError = true;
        }
        if (hasError) {
            return;
        }

        this.dispatchEvent(new CustomEvent('leave-message:submit', {detail: {name, message}}));
        this.name.value = '';
        this.captcha.value = '';
        this.message.value = '';
    }

    focus() {
        this.name.focus();
    }
}

customElements.define('comments-leave-message', LeaveMessage);