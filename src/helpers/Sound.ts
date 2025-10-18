import { Howl, Howler } from "howler";

class Sound {
    private static instance: Sound;
    private _sounds: Map<string, Howl>;
    private _active: boolean = true;

    private constructor() {
        this._sounds = new Map();
    }

    public get active(): boolean {
        return this._active;
    }

    public setActive(active: boolean): void {
        this._active = active;
        Howler.mute(!active);
    }

    public static getInstance(): Sound {
        if (!Sound.instance) {
            Sound.instance = new Sound();
        }
        return Sound.instance;
    }

    async loadSound(key: string, url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const sound = new Howl({
                src: [url],
                preload: true,
                onload: () => {
                    this._sounds.set(key, sound);
                    resolve();
                },
                onloaderror: (id, error) => {
                    console.error(`Failed to load sound "${key}" from URL: ${url}`, error);
                    reject(error);
                }
            });
        });
    }

    public playSound(key: string, loop: boolean = false, volume: number = 1.0): void {
        if (!this._active) {
            return;
        }

        const sound = this._sounds.get(key);
        if (!sound) {
            console.error(`Sound "${key}" not found!`);
            return;
        }

        sound.loop(loop);
        sound.volume(volume);
        sound.play();
    }

    public stopSound(key: string): void {
        const sound = this._sounds.get(key);
        if (sound) {
            sound.stop();
        }
    }

    public setVolume(key: string, volume: number): void {
        const sound = this._sounds.get(key);
        if (sound) {
            sound.volume(Math.max(0, Math.min(1, volume)));
        }
    }

    public stopAllSounds(): void {
        Howler.stop();
    }
}

export default Sound.getInstance();
export { Sound };
