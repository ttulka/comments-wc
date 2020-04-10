export default (function(text) {
    this.textContent = text;
    return this.innerHTML;
}).bind(document.createElement('div'));