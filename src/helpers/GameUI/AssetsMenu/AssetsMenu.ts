import ScaledContainer from "../../Scale/ScaledContainer";
import { AssetMenuConfig, UIAssetConfig } from "../../../types/game";
import { Graphics } from "pixi.js";
import AssetButton from "./AssetButton";
import PlaneBasicAnimations from "../../../utils/PlaneBasicAnimations";

export default class CategoriesMenu extends ScaledContainer {
    private _assetButtons: AssetButton[] = [];
    private _tag: string = '';
    private _isActive: boolean = false;
    constructor(assetMenuConfig: AssetMenuConfig) {
        super();
        
        this._tag = assetMenuConfig.tag;
        this._createMenu(assetMenuConfig);
        this._setScaler(assetMenuConfig.uiAssetConfig);
        
        this.deactivateButtons();
        this.alpha = 0;
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    public get assetButtons(): AssetButton[] {
        return this._assetButtons;
    }

    private _setScaler(uiAssetConfig: UIAssetConfig): void {
        this.scaler.setSizes(uiAssetConfig);
        this.scaler.setOriginalSize(this.width, this.height);
        this.scaler.resize(window.innerWidth, window.innerHeight);
    }

    public get tag(): string {
        return this._tag;
    }

    private _createMenu(assetMenuConfig: AssetMenuConfig): void {
        const buttonsData = assetMenuConfig.buttonsData;
        const offsetX = ((assetMenuConfig.buttonsConfig.length - 1) * buttonsData.buttonSpacing) / 2;
        for (let i = 0; i < assetMenuConfig.buttonsConfig.length; i++) {
            const assetButtonConfig = assetMenuConfig.buttonsConfig[i];

            const assetButton: AssetButton = new AssetButton(assetButtonConfig);
            assetButton.x = i * buttonsData.buttonSpacing - offsetX;
            assetButton.setSize(buttonsData.buttonSize.x, buttonsData.buttonSize.y);
            this.addChild(assetButton);
            this._assetButtons.push(assetButton);
        }

        const background = new Graphics().roundRect(0, 0, this.width + buttonsData.buttonSpacing * 0.5, this.height + 
            buttonsData.buttonSpacing * 0.5, 100);
        background.fill({color: 0x000000, alpha: 0.5});
        background.pivot.set(background.width * 0.5, background.height * 0.5);
        this.addChildAt(background, 0);
    }

    public show(): void {
        this._isActive = true;
        this.scaler.resize(window.innerWidth, window.innerHeight);
        this.alpha == 0 && (this.alpha = 1);
        PlaneBasicAnimations.popObject(this, () => this.activateButtons());
    }

    public hide(): void {
        this._isActive = false;
        this.deactivateButtons();
        PlaneBasicAnimations.unpopObject(this);
    }

    public activateButtons(): void {
        for (const button of this._assetButtons) {
            button.eventMode = 'static';
        }
    }

    public deactivateButtons(): void {
        for (const button of this._assetButtons) {
            button.eventMode = 'none';
        }
    }

}