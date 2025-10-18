import ScaledContainer from "./ScaledContainer"
import SpineAnimation from "../SpineAnimation";
import { SpineButtonConfig } from "../../types/game";
import { Graphics, Rectangle } from "pixi.js";
import eventsSystem from "../EventsSystem";

export default class ScaledSpineButton extends ScaledContainer {
    private _spineAnimation!: SpineAnimation;
    private _startAnimationName: string = '';
    private _tapAnimationName: string = '';
    constructor(x: number, y: number, spineButtonConfig: SpineButtonConfig) {
        super();
        this._setAnimationNames(spineButtonConfig.showAnimationName, spineButtonConfig.tapAnimationName);
        this._createSpineAnimation(spineButtonConfig.skeleton, spineButtonConfig.atlas);
        this.scaler.setPortraitScreenPosition(spineButtonConfig.portraitPosition.x, spineButtonConfig.portraitPosition.y);
        this.scaler.setPortraitScreenSize(spineButtonConfig.portraitSize.width, spineButtonConfig.portraitSize.height);
        this.scaler.setLandscapeScreenPosition(spineButtonConfig.landscapePosition.x, spineButtonConfig.landscapePosition.y);
        this.scaler.setLandscapeScreenSize(spineButtonConfig.landscapeSize.width, spineButtonConfig.landscapeSize.height);
        this._createInputArea(spineButtonConfig.buttonSize.width, spineButtonConfig.buttonSize.height, spineButtonConfig.tag);
    }

    private _setAnimationNames(showAnimationName: string, tapAnimationName: string): void {
        this._startAnimationName = showAnimationName;
        this._tapAnimationName = tapAnimationName;
    }

    private _createSpineAnimation(skeleton: string, atlas: string): void {
        this._spineAnimation = new SpineAnimation(0, 0, {skeleton: skeleton, atlas: atlas});
        this.addChild(this._spineAnimation);
    }

    private _createInputArea(width: number, height: number, tag: string): void {
        this.hitArea = new Rectangle(-width * 0.5, -height * 0.5, width, height);
        this.eventMode = 'static';
        this.cursor = 'pointer';
        this.on('pointerdown', () => {
            this._spineAnimation.playAnimation(this._tapAnimationName, false);
            eventsSystem.emit('pressButton', tag, this._spineAnimation.getAnimationDuration(this._tapAnimationName));
        });
        this.eventMode = 'none';
        this.scaler.setOriginalSize(width, height);
    }

    public playShowAnimation(loop: boolean = false): void {
        this.alpha = 1;
        this._spineAnimation.playAnimation(this._startAnimationName, loop);
    }

    public playTapAnimation(loop: boolean = false): void {
        this._spineAnimation.playAnimation(this._tapAnimationName, loop);
    }

    public get spineAnimation(): SpineAnimation {
        return this._spineAnimation;
    }
}