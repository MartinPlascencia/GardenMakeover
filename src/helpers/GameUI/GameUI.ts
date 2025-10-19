import ObjectButton from './ObjectButton';
import ScaledSprite from '../Scale/ScaledSprite';
import { Container, Application, Sprite, Assets } from 'pixi.js';

export default class GameUI extends Container {
    private _addButton!: ObjectButton;
    constructor(app: Application) {
        super();
        app.stage.addChild(this);

        const addButton = new ObjectButton('object_button');
        addButton.scaler.setPortraitScreenPosition(0.5, 0.5);
        addButton.scaler.setPortraitScreenSize(0.2, 0.1);
        addButton.scaler.setLandscapeScreenPosition(0.5, 0.5);
        addButton.scaler.setLandscapeScreenSize(0.1, 0.1);
        addButton.scaler.setOriginalSize(addButton.width, addButton.height);
        addButton.anchor.set(0.5);
        addButton.position.set(200,200);
        this._addButton = addButton;
        app.stage.addChild(this._addButton);

        this.resize(app.screen.width, app.screen.height);
        console.log('Game UI created');
    }

    public resize(width: number, height: number): void {
        this._addButton.scaler.resize(width, height);
    }




}