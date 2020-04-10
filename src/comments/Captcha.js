export default class Captcha {
    constructor() {
        this.code = '';
    }

    getCode() {
        return this.code;
    }

    create(canvas) {
        const generateCode = (length = 4, abc = '23456789bcdfghkmnpqrstvwxyz') => {
            let code = '';
            for (let i = 0; i < length; i++) {
                code += abc.charAt(Math.floor(abc.length * Math.random()));
            }
            return code;
        }

        const renderCanvas = (canvas, code) => {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Create gradients
            const grdBW = ctx.createLinearGradient(0, 0, canvas.width, 0);
            grdBW.addColorStop(0, 'black');
            grdBW.addColorStop(1, 'white');

            const grdWB = ctx.createLinearGradient(0, 0, canvas.width, 0);
            grdWB.addColorStop(0, 'white');
            grdWB.addColorStop(1, 'black');

            // Fill with gradient
            ctx.fillStyle = grdBW;
            ctx.fillRect(0, 0, canvas.width, 25);

            // Text
            ctx.fillStyle = grdWB;
            ctx.font = '54px Courier New';
            ctx.fillText(code, 15, 40);
        }

        this.code = generateCode();
        renderCanvas(canvas, this.code);
    }
}