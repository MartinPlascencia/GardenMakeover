import ScaledSprite from "../Scale/ScaledSprite";
import { Assets } from "pixi.js";
import gsap from "gsap";

export default class ObjectButton extends ScaledSprite {
    constructor(textureName: string) {
        super(Assets.get(textureName));

        this.eventMode = 'static';
        this.cursor = 'pointer';
        this.on('pointerdown', this._pressButton.bind(this));
    }

    private _pressButton(): void {
        console.log('ObjectButton pressed');
        this.eventMode = 'none';
        gsap.to(this.scale, { 
            x: this.scale.x * 0.8, 
            y: this.scale.y * 0.8, 
            duration: 0.1 , 
            yoyo: true, 
            repeat: 1,
            ease: 'linear',
            onComplete: () => {
                this.eventMode = 'static';
            }
        });
    }

}