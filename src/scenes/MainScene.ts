import { Application, Sprite, Graphics, Assets, Rectangle, BlurFilter, BitmapText, Container} from 'pixi.js';
import { sdk } from '@smoud/playable-sdk';
import * as THREE from 'three';
import AssetsInlineHelper from '../helpers/AssetsInlineHelper';
import ModelAsset from '../helpers/ModelAsset';
import GameUI from '../helpers/GameUI/GameUI';
import SplashEffect from '../helpers/SplashEffect';
import { ModelData } from '../types/game';
import gsap from 'gsap';

import eventsSystem from '../utils/EventsSystem';
import sound from '../utils/Sound';
import PlaneBasicAnimations from '../utils/PlaneBasicAnimations';
export default class MainScene {
    private _active: boolean = true;
    private _assetsInlineHelper!: AssetsInlineHelper;

    private _scene: THREE.Scene;
    private _renderer: THREE.WebGLRenderer;
    private _camera: THREE.PerspectiveCamera;
    private _clock: THREE.Clock;
    private _groundModel!: ModelAsset;
    private _activeModels: ModelAsset[] = [];
    private _ambientLight!: THREE.AmbientLight;
    private _directionalLight!: THREE.DirectionalLight;
    private _isPaused: boolean = false;
    private _gameUI!: GameUI;
    private _splashParticles!: SplashEffect;
    private _currentObjectPosition: THREE.Vector3 = new THREE.Vector3();
    private _modelPlaceHolder!: ModelAsset;


    constructor(app: Application, assetsInlineHelper: AssetsInlineHelper) {

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
        this._create();

        this._gameUI = new GameUI(app);

        sdk.on('interaction', (count: number) => {
            console.log(`Interaction count: ${count}`);

            if (sdk.interactions >= 10) {
                sdk.finish();
            }
        });

        this._addEvents();

    }

    private _addEvents(): void {
        eventsSystem.on('addObjectButtonPressed', this._addButtonPressed.bind(this)); 
        eventsSystem.on('assetButtonPressed', this._createObject.bind(this));  
        eventsSystem.on('toggleDayNight', this._changeDayNight.bind(this));
    }

    private _changeDayNight(isDay: boolean): void {
        sound.playSound('click');
        isDay ? this._setDayLight(2) : this._setNightLight(2);
    }

    private _addButtonPressed(position: THREE.Vector3): void {
        sound.playSound('click_add');
        this._currentObjectPosition = position;
        this._modelPlaceHolder.position.set(position.x, position.y, position.z);
        this._modelPlaceHolder.visible = true;
        PlaneBasicAnimations.popObject3D(this._modelPlaceHolder);
    }

    private _createObject(modelData: ModelData): void {
        sound.playSound('place_object');
        let modelAsset: ModelAsset;

        if (modelData.parentName) {
            const parentModelData = this._assetsInlineHelper.models[modelData.parentName];
            modelAsset = new ModelAsset(parentModelData.model, modelData.modelName, parentModelData.animationClips);
        } else {
            const modelConfig = this._assetsInlineHelper.models[modelData.modelName];
            modelAsset = new ModelAsset(modelConfig.model, undefined, modelConfig.animationClips);
        }

        modelData.animationName && modelAsset.playAnimation(modelData.animationName);
        modelAsset.position.set(this._currentObjectPosition.x, this._currentObjectPosition.y, this._currentObjectPosition.z);
        modelAsset.scale.set(modelData.scale, modelData.scale, modelData.scale);
        this._scene.add(modelAsset);
        this._activeModels.push(modelAsset);

        PlaneBasicAnimations.unpopObject3D(this._modelPlaceHolder);
        PlaneBasicAnimations.popObject3D(modelAsset);
        sound.playSound(modelData.soundName);

        this._splashParticles.reset(this._currentObjectPosition);
        this._shakeCamera(0.5, 0.2);
    }

    private _createLights(): void {
        this._ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
        this._scene.add(this._ambientLight);

        this._directionalLight = new THREE.DirectionalLight(0xffffff, 5);
        this._directionalLight.position.set(5, 20, 7.5);
        this._scene.add(this._directionalLight);

        this._setNightLight(0);

    }

    private _setNightLight(duration: number = 0): void {
        sound.playSound('irons');
        gsap.to(this._ambientLight, {
            intensity: 0.5,
            duration: duration,
        });
        gsap.to(this._directionalLight, {
            intensity: 1.5,
            duration: duration,
        });
        this._scene.background = new THREE.Color(0x001e2d);
    }

    private _setDayLight(duration: number = 0): void {

        sound.playSound('rooster');
        gsap.to(this._ambientLight, {
            intensity: 3,
            duration: duration,
        });
        gsap.to(this._directionalLight, {
            intensity: 5,
            duration: duration,
        });
        this._scene.background = new THREE.Color(0x9cfff0);
    }

    private _createModels(): void { 
        this._groundModel = new ModelAsset(this._assetsInlineHelper.models['ground'].model);
        this._groundModel.scale.set(0.5, 0.5, 0.5);
        this._scene.add(this._groundModel);

        const objectsModel = this._assetsInlineHelper.models['objects'];
        this._modelPlaceHolder = new ModelAsset(objectsModel.model, 'placeholder');
        this._modelPlaceHolder.scale.set(0.3, 0.3, 0.3);
        this._modelPlaceHolder.position.set(0, 3, 0);
        this._modelPlaceHolder.visible = false;
        const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this._modelPlaceHolder.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                (child as THREE.Mesh).material = basicMaterial;
            }
        });
        this._scene.add(this._modelPlaceHolder);

        this._splashParticles = new SplashEffect(this._assetsInlineHelper.textures['smoke'], 20, 2.5);
        this._scene.add(this._splashParticles.object3D);
    }

    private _create(): void {

        this._createLights();
        this._createModels();

        this._animate();
        this._animateScene();
    }

    private async _animateScene(): Promise<void> {
        this._updateCameraPosition(window.innerWidth, window.innerHeight);
        this._setDayLight(2);
        await gsap.from(this._camera.position,{
            y:60,
            duration: 3,
            ease: "power2.out",
            onUpdate: () => {
                this._camera.lookAt(0, 0, 0);
            }
        });

        sound.playSound('theme', true);
        this._gameUI.showAddObjectButtons(0.3);
        this._gameUI.showDayButton();
    }

    private update(): void {
        const delta = this._clock.getDelta();
        this._activeModels.forEach(model => {
            model.animationMixer?.update(delta);
        });
        this._splashParticles.update(delta, this._camera.position);
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

        this._updateCameraPosition(width, height);
        this._renderer.setSize(width, height);
        this._gameUI.resize(width, height);
    }

    private _updateCameraPosition(width: number, height: number): void {
        this._camera.aspect = width / height;
        const minDistance = 8;  
        const maxDistance = 18; 

        const normalizedWidth = Math.min(Math.max((width - 400) / 1200, 0), 1);
        const distance = maxDistance - (maxDistance - minDistance) * normalizedWidth;

        this._camera.position.x = 0;
        this._camera.position.y = distance;
        this._camera.position.z = distance;
        this._camera.lookAt(0, 0, 0);
        this._camera.updateProjectionMatrix();
    }

    private _shakeCamera(duration: number = 0.5, magnitude: number = 0.1): void {
        const originalPosition = this._camera.position.clone();
        const tl = gsap.timeline();

        const shakes = Math.floor(duration / 0.02); // number of shake steps
        for (let i = 0; i < shakes; i++) {
            tl.to(this._camera.position, {
                x: originalPosition.x + (Math.random() - 0.5) * magnitude,
                y: originalPosition.y + (Math.random() - 0.5) * magnitude,
                z: originalPosition.z + (Math.random() - 0.5) * magnitude,
                duration: 0.02,
                ease: "power1.inOut"
            });
        }

        tl.to(this._camera.position, {
            x: originalPosition.x,
            y: originalPosition.y,
            z: originalPosition.z,
            duration: 0.05,
            ease: "power1.out"
        });
    }

    public get active(): boolean {
        return this._active;
    }


}