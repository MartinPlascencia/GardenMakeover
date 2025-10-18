import { BitmapText, TextOptions } from 'pixi.js';
import Scaler from './Scaler';
export default class ScaledBitmapText extends BitmapText {
    private _scaler: Scaler;
    constructor(options?: TextOptions) {
        super(options);
        this._scaler = new Scaler(this);
    }

    public wrapText(width: number): void {
        if (this.width > width) {
            this.scale.set(width / this.width);
        } else {
            this.scale.set(1);
        }
    }

    public get scaler(): Scaler {
        return this._scaler;
    }
}