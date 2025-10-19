import { Application, Sprite, Graphics, Assets, Rectangle, BlurFilter, BitmapText, Container} from 'pixi.js';
import { sdk } from '@smoud/playable-sdk';
import BasicAnimations from '../helpers/BasicAnimations';
import * as THREE from 'three';
import AssetsInlineHelper from '../helpers/AssetsInlineHelper';
import ModelAsset from '../helpers/ModelAsset';
import GameUI from '../helpers/GameUI/GameUI';

import sound from '../helpers/Sound';
import Game from '../Game';

export default class MainScene {
    private _active: boolean = true;
    private _assetsInlineHelper!: AssetsInlineHelper;

    private _scene: THREE.Scene;
    private _renderer: THREE.WebGLRenderer;
    private _camera: THREE.PerspectiveCamera;
    private _clock: THREE.Clock;
    private _groundModel!: ModelAsset;
    private _cowModel!: ModelAsset;
    private _chickenModel!: ModelAsset;
    private _ambientLight!: THREE.AmbientLight;
    private _directionalLight!: THREE.DirectionalLight;
    private _isPaused: boolean = false;
    private _gameUI!: GameUI;

    constructor(app: Application, basicAnimations: BasicAnimations, assetsInlineHelper: AssetsInlineHelper) {

        this._assetsInlineHelper = assetsInlineHelper;

        this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this._renderer.setSize(app.screen.width, app.screen.height);
        this._renderer.setPixelRatio(Math.max(2, window.devicePixelRatio || 1));
        document.body.appendChild(this._renderer.domElement);

        const pixiCanvas = app.canvas;
        const parent = pixiCanvas.parentElement || document.body;
        parent.insertBefore(this._renderer.domElement, pixiCanvas);
        this._renderer.domElement.style.position = "absolute";
        this._renderer.domElement.style.top = "0";
        this._renderer.domElement.style.left = "0";
        this._renderer.domElement.style.zIndex = "0";  // Three.js = background
        this._renderer.domElement.style.pointerEvents = "none"; // Disable interaction

        pixiCanvas.style.position = "absolute";
        pixiCanvas.style.top = "0";
        pixiCanvas.style.left = "0";
        pixiCanvas.style.zIndex = "1"; // Pixi.js = foreground
        pixiCanvas.style.pointerEvents = "auto"; // Enable interaction

        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0x9cfff0);

        this._camera = new THREE.PerspectiveCamera(75, app.screen.width / app.screen.height, 0.1, 1000);
        this._camera.position.set(0, 12, 12);
        this._camera.lookAt(0, 0, 0);

        this._clock = new THREE.Clock();

        this._groundModel = new ModelAsset(this._assetsInlineHelper.models['ground'].model);
        this._create();

        this._gameUI = new GameUI(app);

        sdk.on('interaction', (count: number) => {
            console.log(`Interaction count: ${count}`);

            if (sdk.interactions >= 10) {
                sdk.finish();
            }
        });

    }

    private _create(): void {

        sound.playSound('theme', true);
        this._ambientLight = new THREE.AmbientLight(0xffffff, 2);
        this._scene.add(this._ambientLight);

        this._directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        this._directionalLight.position.set(0, 1, 1);
        this._scene.add(this._directionalLight);

        this._groundModel.scale.set(0.5, 0.5, 0.5);
        this._scene.add(this._groundModel);

        const objectsModel = this._assetsInlineHelper.models['objects'];
        this._cowModel = new ModelAsset(objectsModel.model, 'cow_1', objectsModel.animationClips);
        this._cowModel.visible = true;
        this._cowModel.position.set(0, 3, 0);
        this._cowModel.playAnimation('action_cow');
        this._scene.add(this._cowModel);
        
        this._chickenModel = new ModelAsset(objectsModel.model, 'chicken_1', objectsModel.animationClips);
        this._chickenModel.visible = true;
        this._chickenModel.scale.set(1, 1, 1);
        this._chickenModel.position.set(5, 3, 0);
        this._chickenModel.playAnimation('action_chicken');
        this._scene.add(this._chickenModel);

        this._animate();
    }

    private update(): void {
        const delta = this._clock.getDelta();
        this._cowModel.animationMixer?.update(delta);
        this._chickenModel.animationMixer?.update(delta);
    }

    private _animate(): void {
        requestAnimationFrame(() => this._animate());

        if (!this._isPaused) this.update();
        this._renderer.render(this._scene, this._camera);
    }


    private _isPortrait(): boolean {
        return window.innerWidth < window.innerHeight;
    }

    public resize(width: number, height: number): void {

        this._camera.aspect = width / height;
        this._camera.position.z = width > height ? 12 : 15;
        this._camera.lookAt(0, 0, 0);
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);

        this._gameUI.resize(width, height);
    }

    public get active(): boolean {
        return this._active;
    }


}