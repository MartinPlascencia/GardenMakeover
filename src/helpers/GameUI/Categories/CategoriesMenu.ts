import ScaledContainer from "../../Scale/ScaledContainer";
import { CategoryMenuConfig, UIAssetConfig } from "../../../types/game";
import { Graphics } from "pixi.js";
import CategoryButton from "./CategoryButton";
import PlaneBasicAnimations from "../../../utils/PlaneBasicAnimations";

export default class CategoriesMenu extends ScaledContainer {
    private _categoryButtons: CategoryButton[] = [];
    private _active: boolean = false;
    constructor(categoryMenuConfig: CategoryMenuConfig) {
        super();
        
        this._createMenu(categoryMenuConfig);
        this._setScaler(categoryMenuConfig.uiAssetConfig);
        
        this.deactivateButtons();
        this.alpha = 0;
    }

    public get isActive(): boolean {
        return this._active;
    }

    private _setScaler(uiAssetConfig: UIAssetConfig): void {
        this.scaler.setSizes(uiAssetConfig);
        this.scaler.setOriginalSize(this.width, this.height);
        this.scaler.resize(window.innerWidth, window.innerHeight);
    }

    private _createMenu(categoryMenuConfig: CategoryMenuConfig): void {
        const buttonsData = categoryMenuConfig.buttonsData;
        const offsetX = ((categoryMenuConfig.categoryButtons.length - 1) * buttonsData.buttonSpacing) / 2;
        for (let i = 0; i < categoryMenuConfig.categoryButtons.length; i++) {
            const categoryButtonConfig = categoryMenuConfig.categoryButtons[i];

            const categoryButton: CategoryButton = new CategoryButton(categoryButtonConfig);
            categoryButton.x = i * buttonsData.buttonSpacing - offsetX;
            categoryButton.setSize(buttonsData.buttonSize.x, buttonsData.buttonSize.y);
            this.addChild(categoryButton);
            this._categoryButtons.push(categoryButton);
        }

        const background = new Graphics().roundRect(0, 0, this.width + buttonsData.buttonSpacing * 0.5, this.height + 
            buttonsData.buttonSpacing * 0.5, 100);
        background.fill({color: 0x000000, alpha: 0.5});
        background.pivot.set(background.width * 0.5, background.height * 0.5);
        this.addChildAt(background, 0);
    }

    public show(): void {
        this.alpha == 0 && (this.alpha = 1);
        this._active = true;
        this.activateButtons();
        PlaneBasicAnimations.popObject(this);
    }

    public hide(): void {
        this._active = false;
        this.deactivateButtons();
        PlaneBasicAnimations.unpopObject(this);
    }

    public activateButtons(): void {
        for (const button of this._categoryButtons) {
            button.eventMode = 'static';
        }
    }

    public deactivateButtons(): void {
        for (const button of this._categoryButtons) {
            button.eventMode = 'none';
        }
    }

}