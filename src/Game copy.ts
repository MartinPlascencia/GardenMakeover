import { sdk } from '@smoud/playable-sdk';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import buttonBg from 'assets/sprites/button.png';
import storkModel from 'assets/models/Stork.glb';

export class Game {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private uiContainer: HTMLDivElement;
  private installButton: HTMLDivElement;
  private buttonImage: HTMLImageElement;
  private storkModel: THREE.Group;
  private mixer: THREE.AnimationMixer;
  private clock: THREE.Clock;
  public isPaused: boolean = false;

  constructor(width: number, height: number) {
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(1.5);
    document.body.appendChild(this.renderer.domElement);

    // Create THREE.js scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x001a2d);

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    // Initialize clock for animations
    this.clock = new THREE.Clock();

    // Create UI container
    this.uiContainer = document.createElement('div');
    this.uiContainer.style.cssText = 'position: absolute; top: 0px; left: 0px; transform-origin: top left;';
    document.body.appendChild(this.uiContainer);

    // Load button image
    this.buttonImage = new Image();
    this.buttonImage.src = buttonBg;
    this.buttonImage.onload = () => {
      // Load Stork model
      const loader = new GLTFLoader();
      loader.load(storkModel, (gltf) => {
        this.storkModel = gltf.scene;

        // Set up animation mixer
        this.mixer = new THREE.AnimationMixer(this.storkModel);

        // Play first animations
        if (gltf.animations.length > 0) {
          const action = this.mixer.clipAction(gltf.animations[0]);
          // Лети лелеко лети
          // На білих крилах своїх за небокрай
          action.play();
        }

        this.create();
      });
    };
  }

  public create(): void {
    this.createUI();

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    this.storkModel.scale.set(0.5, 0.5, 0.5);
    this.scene.add(this.storkModel);

    // Set up interaction listener
    sdk.on('interaction', (count: number) => {
      console.log(`Interaction count: ${count}`);

      if (sdk.interactions >= 10) {
        sdk.finish();
      }
    });

    // Start animation loop
    this.animate();

    sdk.start();
  }

  private createUI(): void {
    this.installButton = document.createElement('div');
    this.installButton.style.cssText =
      'cursor: pointer; width: 200px; display: flex; align-items: center; justify-content: center; margin: 20px;';
    this.installButton.onclick = () => sdk.install();

    // Add image
    this.buttonImage.style.width = '100%';
    this.installButton.appendChild(this.buttonImage);

    // Add text overlay
    const text = document.createElement('div');
    text.textContent = 'Install';
    text.style.cssText =
      'position: absolute ;color: rgb(255 255 255);font-size: 35px;font-weight: bold;text-shadow: rgb(255 252 106 / 63%) 4px 3px 9px;pointer-events: none;font-family: cursive;';
    this.installButton.appendChild(text);

    this.uiContainer.appendChild(this.installButton);
  }

  private update(): void {
    if (this.mixer) {
      const delta = this.clock.getDelta();
      this.mixer.update(delta);
    }

    if (this.storkModel) {
      this.storkModel.rotation.y += 0.01;
    }
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    if (!this.isPaused) this.update();

    this.renderer.render(this.scene, this.camera);
  }

  public resize(width: number, height: number): void {
    // Update container size
    this.uiContainer.style.width = `${width}px`;
    this.uiContainer.style.height = `${height}px`;

    // Calculate scale based on screen dimensions
    const scaleX = width / 320;
    const scaleY = height / 480;
    const scale = Math.min(scaleX, scaleY); // Use smaller scale to fit both dimensions

    this.uiContainer.style.transform = `scale(${scale})`;

    // Update camera aspect ratio
    this.camera.aspect = width / height;
    this.camera.position.z = width > height ? 80 : 160;
    this.camera.updateProjectionMatrix();

    // Resize renderer
    this.renderer.setSize(width, height);
  }

  public pause(): void {
    this.isPaused = true;
    console.log('Game paused');
  }

  public resume(): void {
    this.isPaused = false;
    console.log('Game resumed');
  }

  public volume(value: number): void {
    console.log(`Volume changed to: ${value}`);
  }

  public finish(): void {
    console.log('Game finished');
  }
}
