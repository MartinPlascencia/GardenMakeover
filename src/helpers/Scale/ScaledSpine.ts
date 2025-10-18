import ScaledContainer from './ScaledContainer';
import SpineAnimation from '../SpineAnimation';
export default class ScaledSpine extends ScaledContainer {
    private _spineAnimation!: SpineAnimation;
    constructor(spineData: {skeleton: string, atlas: string}) {
        super();
        this._createSpineAnimation(spineData);
    }

    public setSize(width: number, height: number): void {
        this.scaler.setOriginalSize(width, height);
    }

    private _createSpineAnimation(spineData: {skeleton: string, atlas: string}): void {
        this._spineAnimation = new SpineAnimation(0, 0, spineData);
        this.addChild(this._spineAnimation);
    }

    public playAnimation(animationName: string, loop: boolean = false): void {
        this._spineAnimation.playAnimation(animationName, loop);
    }

    public get spineAnimation(): SpineAnimation {
        return this._spineAnimation;
    }
}