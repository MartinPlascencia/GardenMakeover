import { Assets, AssetsManifest } from 'pixi.js';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Group, AnimationMixer, AnimationClip } from 'three';

import progressBar from '../../assets/sprites/progress_bar.png';
import progressBarFill from '../../assets/sprites/progress_bar_fill.png';
import button from '../../assets/sprites/button.png';
import objectButton from '../../assets/sprites/plus-button.png';
import categoryButton from '../../assets/sprites/category_button.png';
import strawberry from '../../assets/sprites/strawberry.png';
import tomato from '../../assets/sprites/tomato.png';
import corn from '../../assets/sprites/corn.png';
import grape from '../../assets/sprites/grape.png';
import cow from '../../assets/sprites/cow.png';
import chicken from '../../assets/sprites/chicken.png';
import sheep from '../../assets/sprites/sheep.png';
import dayButton from '../../assets/sprites/day_button.png';
import nightButton from '../../assets/sprites/night_button.png';

import ground from '../../assets/models/ground2.glb';
import objects from '../../assets/models/objects2.glb';

import groboldFont from '../../assets/fonts/grobold.ttf';

import themeSong from '../../assets/sounds/theme.mp3';

import manifestJson from '../data/assetsManifest.json';
import sound from '../utils/Sound';

type AssetEntry = {
    alias: string;
    src: string;
};

export type AnimatedModel = {
    model: Group;
    animationMixer: AnimationMixer;
    animationClips: AnimationClip[];
}

export default class AssetsInlineHelper {
    private _manifest!: AssetsManifest;
    private _modelEntries: AssetEntry[] = [];
    private _sounds: AssetEntry[] = [];
    private _models: Record<string, AnimatedModel> = {};

    constructor() {
        this._createManifestFromJson();
    }

    private async _createManifestFromJson(): Promise<void> {
        const manifestJson = {
            bundles: [
                {
                    name: "load-screen",
                    assets: [
                        { alias: "progress_bar", src: progressBar},
                        { alias: "progress_bar_fill", src: progressBarFill},
                        { alias: "object_button", src: objectButton },
                        { alias: "category_button", src: categoryButton },
                        { alias: "strawberry", src: strawberry },
                        { alias: "tomato", src: tomato },
                        { alias: "corn", src: corn },
                        { alias: "grape", src: grape },
                        { alias: "cow", src: cow },
                        { alias: "chicken", src: chicken },
                        { alias: "sheep", src: sheep },
                        { alias: "day_button", src: dayButton },
                        { alias: "night_button", src: nightButton }
                    ]
                },
                {
                    name: "game-screen",
                    assets: [
                        { alias: "button", src: button }
                    ]
                }, 
            ],
            models: [
                {
                    alias: "ground",
                    src: ground
                },
                {
                    alias: "objects",
                    src: objects
                }
            ],
            sounds: [
                { 
                    alias: "theme", 
                    src: themeSong
                }
            ]
        };
        this._manifest = {
            bundles: (manifestJson.bundles || []).map((bundle: any) => ({
                name: bundle.name,
                assets: (bundle.assets || []).map((a: AssetEntry) => ({
                    alias: a.alias,
                    src: a.src,
                })),
            })),
        };

        this._modelEntries = (manifestJson.models || []).map((m: AssetEntry) => ({
            alias: m.alias,
            src: m.src,
        }));

        this._sounds = manifestJson.sounds;
    }

    public get models(): Record<string, AnimatedModel> {
        return this._models;
    }

    public async loadBundleByName(bundleName: string, progressCallback?: (progress: number) => void): Promise<void> {
        const bundle = this._manifest.bundles.find(b => b.name === bundleName);
        if (!bundle) {
            console.warn(`Bundle "${bundleName}" not found in manifest.`);
            return;
        }

        Assets.addBundle(bundle.name, bundle.assets);
        await Assets.loadBundle(bundleName, progress => {
            progressCallback && progressCallback(progress);
        }).catch((error) => {
            console.error(`Error loading bundle:${bundleName}`, error);
        });
    }

    public async loadFonts(): Promise<void> {
        await this._loadFonts('grobold', groboldFont);
    }

    private async _loadFonts(name: string, url: string): Promise<void> {
        const font = new FontFace(name, `url(${url})`);
        await font.load();
        document.fonts.add(font);
        console.log(`Font "${name}" loaded`);
    }

    public async loadModels(onProgress?: (alias: string, loaded: number, total: number) => void): Promise<void> {
        const loader = new GLTFLoader();

        for (const model of this._modelEntries) {
            const modelUrl = model.src;
            const alias = model.alias;

            const gltf = await new Promise<GLTF>((resolve, reject) => {
                loader.load(modelUrl, (gltf) => resolve(gltf),
                    (progress) => {
                        if (onProgress) {
                            onProgress(alias, progress.loaded, progress.total ?? 1);
                        }
                    },
                    (err) => reject(err)
                );
            });

            /* gltf.scene.traverse((child) => {
                if (child) {
                    console.log('Found mesh:', alias, child.name, child.type);
                }
            }); */

            console.log("animations", gltf.animations);
            this._models[alias] = {
                model: gltf.scene,
                animationMixer: new AnimationMixer(gltf.scene),
                animationClips: gltf.animations
            };
        }
    }

    public async loadSounds(): Promise<void> {
        this._sounds.forEach(async (currentSound: AssetEntry) => {
            await sound.loadSound(currentSound.alias, currentSound.src);
        });
    }
}
