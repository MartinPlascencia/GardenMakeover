import ScaledSprite from "../Scale/ScaledSprite";
import { Assets } from "pixi.js";
import { AddButtonConfig, UIAssetConfig } from "../../types/game";
import PlaneBasicAnimations from "../../utils/PlaneBasicAnimations";

import eventsSystem from "../../utils/EventsSystem";

export default class ObjectButton extends ScaledSprite {
    private _isActive: boolean = false;
    constructor(buttonConfig: AddButtonConfig) {
        super(Assets.get(buttonConfig.buttonTexture));

        this.scaler.setSizes(buttonConfig.uiAssetConfig);
        this.scaler.setOriginalSize(this.width, this.height);
        this.anchor.set(0.5);

        this._isActive = true;
        this.eventMode = 'static';
        this.cursor = 'pointer';
        this.on('pointerdown', () => {
            eventsSystem.emit('addObjectButtonPressed', buttonConfig.objectPosition, this);
        });
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    public set isActive(value: boolean) {
        this._isActive = value;
    }

}