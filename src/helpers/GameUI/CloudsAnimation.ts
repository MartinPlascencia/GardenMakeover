import gsap from 'gsap';
import { Container, Sprite, Assets } from 'pixi.js';

export default class CloudsAnimation extends Container {
    private _leftCloud: Sprite;
    private _rightCloud: Sprite;
    constructor(leftCloudTexture: string, rightCloudTexture: string, width: number, height: number) {
        super();
        this._leftCloud = new Sprite(Assets.get(leftCloudTexture));
        this._leftCloud.position.set(width * 0.35, height * 0.5);
        this.addChild(this._leftCloud);

        this._rightCloud = new Sprite(Assets.get(rightCloudTexture));
        this._rightCloud.position.set(width * 0.65, height * 0.5);
        this.addChild(this._rightCloud);

        this._leftCloud.anchor.set(0.5);
        this._rightCloud.anchor.set(0.5);

        this._setCloudSize(this._leftCloud, height);
        this._setCloudSize(this._rightCloud, height);
        this.alpha = 0;
    }

    private _setCloudSize(cloud: Sprite, height: number): void {
        cloud.height = height;
        cloud.width = cloud.height * (cloud.texture.width / cloud.texture.height);
    }

    public startAnimation(duration: number): void {
        this.alpha = 1;
        gsap.to(this._leftCloud, {
            x: this._leftCloud.x - this._leftCloud.width,
            duration: duration,
        });
        gsap.to(this._rightCloud, {
            x: this._rightCloud.x + this._rightCloud.width,
            duration: duration,
            onComplete: () => {
                this.alpha = 0;
            }
        });
    }
}