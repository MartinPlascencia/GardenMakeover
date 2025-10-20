import { Sprite, Assets } from "pixi.js";
import { AssetButtonConfig } from "../../../types/game";
import PlaneBasicAnimations from "../../../utils/PlaneBasicAnimations";

import eventsSystem from "../../../utils/EventsSystem";

export default class AssetButton extends Sprite {
    constructor(assetButtonConfig: AssetButtonConfig) {
        super(Assets.get(assetButtonConfig.textureName));
        this.anchor.set(0.5);
        this.eventMode = 'static';
        this.cursor = 'pointer';
        this.on('pointerdown', () => {
            PlaneBasicAnimations.animateButton(this);
            eventsSystem.emit('assetButtonPressed', assetButtonConfig.modelData);
        });
    }
}