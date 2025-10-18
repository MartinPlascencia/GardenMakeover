import { Application, Sprite, Graphics, Assets, Rectangle, BlurFilter, BitmapText} from 'pixi.js';
import BasicAnimations from '../helpers/BasicAnimations';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import AssetsInlineHelper from '../helpers/AssetsInlineHelper';

import sound from '../helpers/Sound';

export default class MainScene {
    private _active: boolean = true;
    private _assetsInlineHelper!: AssetsInlineHelper;

    private _scene: THREE.Scene;
    private _renderer: THREE.WebGLRenderer;
    private _camera: THREE.PerspectiveCamera;
    private _clock: THREE.Clock;
    private _mixer: THREE.AnimationMixer;
    private _groundModel!: THREE.Group;
    private _cowModel!: THREE.Object3D;
    private _chickenModel!: THREE.Object3D;
    private _chickenAnimationMixer!: THREE.AnimationMixer;
    private _ambientLight!: THREE.AmbientLight;
    private _directionalLight!: THREE.DirectionalLight;
    private _cowAnimationMixer!: THREE.AnimationMixer;
    private _isPaused: boolean = false;

    constructor(app: Application, basicAnimations: BasicAnimations, assetsInlineHelper: AssetsInlineHelper) {

        this._assetsInlineHelper = assetsInlineHelper;

        this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this._renderer.setSize(app.screen.width, app.screen.height);
        this._renderer.setPixelRatio(Math.max(2, window.devicePixelRatio || 1));
        document.body.appendChild(this._renderer.domElement);

        const pixiCanvas = app.view;
        const parent = pixiCanvas.parentElement || document.body;
        parent.insertBefore(this._renderer.domElement, pixiCanvas);
        this._renderer.domElement.style.position = "absolute";
        this._renderer.domElement.style.top = "0";
        this._renderer.domElement.style.left = "0";
        this._renderer.domElement.style.zIndex = "0";  // Three.js = background

        pixiCanvas.style.position = "absolute";
        pixiCanvas.style.top = "0";
        pixiCanvas.style.left = "0";
        pixiCanvas.style.zIndex = "1"; // Pixi.js = foreground

        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0x9cfff0);

        this._camera = new THREE.PerspectiveCamera(75, app.screen.width / app.screen.height, 0.1, 1000);
        this._camera.position.set(0, 10, 10);
        this._camera.lookAt(0, 0, 0);

        this._clock = new THREE.Clock();

        this._groundModel = this._assetsInlineHelper.models['ground'].model;

        this._mixer = new THREE.AnimationMixer(this._groundModel);
        if (this._groundModel.animations.length > 0) {
            const action = this._mixer.clipAction(this._groundModel.animations[0]);
            action.play();
        }
        this._create();
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

        const cowModel = this._assetsInlineHelper.models['objects'].model.getObjectByName('cow_1') as THREE.Object3D;
        this._cowModel = SkeletonUtils.clone(cowModel);
        this._cowModel.parent?.remove(this._cowModel);
        this._cowModel.visible = true;
        this._cowModel.scale.set(1, 1, 1);
        this._cowModel.position.set(0, 3, 0);
        this._scene.add(this._cowModel);

        this._cowAnimationMixer = new THREE.AnimationMixer(this._cowModel);
        this._cowAnimationMixer.clipAction(this._assetsInlineHelper.models['objects'].animationClips[2]).play();
        
        this._chickenModel = this._assetsInlineHelper.models['objects'].model.getObjectByName('chicken_1') as THREE.Object3D;
        this._chickenModel.parent?.remove(this._chickenModel);
        this._chickenModel.visible = true;
        this._chickenModel.scale.set(1, 1, 1);
        this._chickenModel.position.set(5, 3, 0);
        this._scene.add(this._chickenModel);

        this._chickenAnimationMixer = new THREE.AnimationMixer(this._chickenModel);
        this._chickenAnimationMixer.clipAction(this._assetsInlineHelper.models['objects'].animationClips[0]).play();

        this._animate();

    }

    private update(): void {
        if (this._mixer) {
            const delta = this._clock.getDelta();
            this._mixer.update(delta);
            this._cowAnimationMixer.update(delta);
            this._chickenAnimationMixer.update(delta);
        }
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
        this._camera.position.z = width > height ? 80 : 160;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    public get active(): boolean {
        return this._active;
    }


}