import ScaledSprite from "../Scale/ScaledSprite";
import PlaneBasicAnimations from "../../utils/PlaneBasicAnimations";
import { Assets } from "pixi.js";
import { UIAssetConfig } from "../../types/game";

import eventsSystem from "../../utils/EventsSystem";

export default class DayNightButton extends ScaledSprite {
    constructor(dayTexture: string, nightTexture: string, dayButtonConfig: UIAssetConfig) {
        super(Assets.get(dayTexture));
        this.scaler.setSizes(dayButtonConfig);
        this.scaler.setOriginalSize(this.width, this.height);
        this.anchor.set(0.5);
        this.eventMode = 'static';
        this.cursor = 'pointer';
        let isDay: boolean = true;
        this.on('pointerdown', () => {
            PlaneBasicAnimations.animateButton(this, undefined, true);
            isDay = !isDay;
            this.texture = isDay ? Assets.get(dayTexture) : Assets.get(nightTexture);
            eventsSystem.emit('toggleDayNight', isDay);
        });
    }
}