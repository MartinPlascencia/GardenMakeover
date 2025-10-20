import { Application } from 'pixi.js';
import PreloadScene from './scenes/PreloadScene';
import MainScene from './scenes/MainScene';
import BasicAnimations from './helpers/BasicAnimations';
import Effects from './helpers/Effects';
import AssetsInlineHelper from './helpers/AssetsInlineHelper';

import sound from './utils/Sound';

export default class Game {
    private _app!: Application;
    private _basicAnimations!: BasicAnimations;
    private _effects!: Effects;
    private _preloadScene!: PreloadScene;
    private _mainScene!: MainScene;
    private _assetsInlineHelper: AssetsInlineHelper = new AssetsInlineHelper();
    constructor() {

    }

    public async initializeGame(width: number, height: number) : Promise<void>{
        this._app = new Application();
        this._basicAnimations = new BasicAnimations();
        await this._app.init({
            autoDensity: true,
            backgroundAlpha: 0,
            resizeTo: window,
            width: width,
            height: height,
            resolution: Math.max(2, window.devicePixelRatio || 1), // High DPI
            antialias: true,
        });
        document.body.appendChild(this._app.canvas);
        this._effects = new Effects(this._app);
        this._preloadScene = new PreloadScene(this._app, this._basicAnimations, this._assetsInlineHelper);
        this._preloadScene.setContinueCallback(this.startGame.bind(this));
    }

    public resize(width: number, height: number) : void {
        this._app.renderer.resize(width, height);
        this._preloadScene != undefined && this._preloadScene.active && this._preloadScene.resize(width, height);
        this._mainScene != undefined && this._mainScene.active && this._mainScene.resize(width, height);
    }

    public startGame() : void {
        this._effects.fadeOut(0.4, () => {
            this._effects.fadeIn(0.4);
            this._preloadScene.clear();
            this._mainScene = new MainScene(this._app, this._assetsInlineHelper);
            //this._app.stage.addChild(this._effects);
        });
    }
}