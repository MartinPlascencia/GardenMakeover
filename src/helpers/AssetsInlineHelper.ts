import { Assets, AssetsManifest } from 'pixi.js';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Group, AnimationMixer, AnimationClip } from 'three';

import progressBar from '../../assets/sprites/progress_bar.png';
import progressBarFill from '../../assets/sprites/progress_bar_fill.png';
import button from '../../assets/sprites/button.png';

import ground from '../../assets/models/ground2.glb';
import objects from '../../assets/models/objects2.glb';
import animals from '../../assets/models/low_poly_animals.glb';

import themeSong from '../../assets/sounds/theme.mp3';

import sound from './Sound';

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
                        { alias: "progress_bar_fill", src: progressBarFill} 
                    ]
                },
                {
                    name: "game-screen",
                    assets: [
                        { alias: "button", src: button }
                    ]
                }
            ],
            models: [
                {
                    alias: "ground",
                    src: ground
                },
                {
                    alias: "objects",
                    src: objects
                },
                {
                    alias: "animals",
                    src: animals
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
                assets: (bundle.assets || []).map((a: any) => ({
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
