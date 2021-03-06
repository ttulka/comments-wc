import Captcha from './Captcha.js';
import ListenersHolder from '../common/ListenersHolder.js';

const MAX_CHARS = 1000;

const THANKS_FOR_MESSAGE = `Thanks for your message!`;
const WRONG_CAPTCHA = `Captcha doesn't seem to match`;
const MAX_CHARS_EXCEEDED = `Only ${MAX_CHARS} characters please.`;

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
        border: 1px solid var(--red, red);
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
        background-color: var(--primary, mediumblue);
        border-color: var(--primary, mediumblue);        
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
        cursor: pointer;
    }
    .title {
        font-size: 1.5em;
        margin-bottom: 0.5em;
    }
    .alert {
        position: relative;
        padding: .75rem 1.25rem;
        margin-bottom: 1rem;
        border: 1px solid transparent;
        border-radius: .25rem;
    }
    .alert.success {
        color: var(--green, green);
        background-color: #d4edda;
        border-color: var(--green, green);
    }
    .alert.error {
        color: var(--red, red);
        background-color: #ffe6e6;
        border-color: var(--red, red);
    }
    </style>
    <div class="title"><slot>Leave a comment</slot></div>
    <form method="post">
        <div class="alert error" style="display: none"></div>
        <div class="alert success" style="display: none"></div>
        <div class="form-row flex">
            <div>
                <input name="name" maxLength="50" placeholder="Name"/>
            </div>
        </div>
        <div class="form-row flex">
            <div>
                <input name="captcha" maxLength="10" placeholder="Captcha" autocomplete="off"/>
            </div>
            <div class="captcha">
                <canvas id="captcha" width="170" height="60"></canvas>
            </div>          
        </div>
        <div class="form-row">
            <div>
                <textarea name="message" rows="5" maxLength="${MAX_CHARS}"></textarea>
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

        // this.dispatchEvent = this.dispatchEvent.bind(this);
        // this.onFormSubmit = this.onFormSubmit.bind(this);
        // this.reloadCaptcha = this.reloadCaptcha.bind(this);
        // this.checkMaxChars = this.checkMaxChars.bind(this);
        // this.showSuccess = this.showSuccess.bind(this);
        // this.showError = this.showError.bind(this);
        // this.cleanAlert = this.cleanAlert.bind(this);
        // this.focus = this.focus.bind(this);

        this.captchaFn = new Captcha();
        this.captchaCanvas = this.root.querySelector('canvas#captcha');

        this.form = this.root.querySelector('form');

        this.error = this.root.querySelector('.alert.error');
        this.success = this.root.querySelector('.alert.success');

        this.name = this.form.querySelector('input[name=name]');
        this.captcha = this.form.querySelector('input[name=captcha]');
        this.message = this.form.querySelector('textarea[name=message]');

        this._listeners = new ListenersHolder();
    }

    connectedCallback() {
        this._listeners.addListener(this.form, 'submit', e => e.preventDefault() & this.onFormSubmit());
        this._listeners.addListener(this.captchaCanvas,'click', e => this.reloadCaptcha());
        this._listeners.addListener(this.message,'keyup', e => this.checkMaxChars());

        this.reloadCaptcha();
    }

    disconnectedCallback() {
        this._listeners.removeAllListeners();
    }

    onFormSubmit() {
        this.cleanAlert();

        const name = this.name.value.trim().substring(0, 50);
        const message = this.message.value.trim().substring(0, 1000);
        const captcha = this.captcha.value.trim();

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
        if (captcha && captcha.toUpperCase() !== this.captchaFn.getCode().toUpperCase()) {
            this.showError(WRONG_CAPTCHA);
            this.captcha.classList.add('error');
            this.captcha.value = '';
            this.reloadCaptcha();
            hasError = true;
        }
        if (hasError) {
            return;
        }

        this.dispatchEvent(new CustomEvent('leave-message:submit', {detail: {name, message}}));
        this.name.value = '';
        this.captcha.value = '';
        this.message.value = '';
        this.reloadCaptcha();
        this.showSuccess(THANKS_FOR_MESSAGE);
    }

    checkMaxChars() {
        this.cleanAlert();
        if (this.message.value.length >= MAX_CHARS) {
            this.showError(MAX_CHARS_EXCEEDED);
        }
    }

    reloadCaptcha() {
        this.captchaFn.create(this.captchaCanvas);
    }

    showSuccess(msg) {
        this.cleanAlert();
        this.success.innerHTML = msg;
        this.success.style.display = 'block';
        setTimeout(() => (this.success.style.display = 'none'), 3000);
    }

    showError(msg) {
        this.cleanAlert();
        this.error.innerHTML = msg;
        this.error.style.display = 'block';
    }

    cleanAlert() {
        this.error.style.display = 'none';
        this.success.style.display = 'none';
    }

    focus() {
        this.name.focus();
    }
}
customElements.define('comments-leave-message', LeaveMessage);