import ObjectButton from './ObjectButton';
import { Container, Application, Sprite, Assets } from 'pixi.js';
import { ButtonsConfig, AddButtonConfig } from '../../types/game';
import CategoriesMenu from './Categories/CategoriesMenu';
import AssetsMenu from './AssetsMenu/AssetsMenu';
import DayNightButton from './DayNightButton';
import TutorialHand from '../TutorialHand';
import gsap from 'gsap';

import sound from '../../utils/Sound';
import eventsSystem from '../../utils/EventsSystem';
import PlaneBasicAnimations from '../../utils/PlaneBasicAnimations';

import buttonsConfig from '../../data/buttonsConfig';

export default class GameUI extends Container {
    private _buttonsConfig: ButtonsConfig = buttonsConfig as ButtonsConfig;
    private _categoriesMenu!: CategoriesMenu;
    private _addButtons: ObjectButton[] = [];
    private _assetsMenus: AssetsMenu[] = [];
    private _dayButton!: DayNightButton;
    private _tutorialHand!: TutorialHand;

    private _currentAssetMenu: AssetsMenu | undefined = undefined;
    private _currentAddObjectButton: ObjectButton | undefined = undefined;
    private _isFirstTime: boolean = true;
    constructor(app: Application) {
        super();
        app.stage.addChild(this);

        this._createAddButtons();
        this._createCategoriesMenu();
        this._createAssetsMenu();
        this._createDayButton();
        this._createTutorialHand();

        this.resize(app.screen.width, app.screen.height);
        this._addEvents();
    }

    private _createDayButton(): void {
        this._dayButton = new DayNightButton('day_button', 'night_button', buttonsConfig.dayButtonConfig);
        this._dayButton.alpha = 0;
        this.addChild(this._dayButton);
    }

    private _createTutorialHand(): void {
        this._tutorialHand = new TutorialHand('hand');
        this.addChild(this._tutorialHand);
    }

    private _addEvents(): void {
        eventsSystem.on('addObjectButtonPressed', this._addButtonPressed.bind(this));
        eventsSystem.on('categoryButtonPressed', this._openAssetsMenu.bind(this));
        eventsSystem.on('assetButtonPressed', this._hideScreens.bind(this));    
    }

    private _hideAddObjectButtons(): void {
        this._addButtons.forEach(button => {
            button.eventMode = 'none';
            PlaneBasicAnimations.unpopObject(button);
        });
    }

    public showAddObjectButtons(delay: number = 0): void {
        this._addButtons.forEach((button, index) => {
            gsap.delayedCall(index * delay, () => {
                sound.playSound('pop_button');
                if (button.isActive) {
                    PlaneBasicAnimations.popObject(button);
                    button.eventMode = 'static';
                }
            });
        });
        if (this._isFirstTime) {
            this._tutorialHand.showTutorialObjects(this._addButtons, delay * this._addButtons.length);
        }
    }

    public showDayButton(): void {  
        PlaneBasicAnimations.popObject(this._dayButton);
    }

    private _showAssetMenu(assetMenu: AssetsMenu): void {
        assetMenu.show();
        this._currentAssetMenu = assetMenu;
    }

    private _openAssetsMenu(categoryName: string): void {
        this._categoriesMenu.deactivateButtons();
        gsap.delayedCall(0.6, () => this._categoriesMenu.activateButtons());
        sound.playSound('category_button');
        const openMenu = this._assetsMenus.find(menu => menu.tag === categoryName);
        if (openMenu === undefined) {
            console.warn(`No assets menu found for category: ${categoryName}`);
            return;
        } else {
            if (this._currentAssetMenu) {
                if (this._currentAssetMenu.tag === openMenu.tag) {
                    return;
                } else {
                    this._currentAssetMenu.hide();
                    this._showAssetMenu(openMenu);
                }
            } else {
                this._showAssetMenu(openMenu);
            }
            if (this._isFirstTime) {
                this._tutorialHand.cancelTutorial();
                this._tutorialHand.showTutorialObjects(openMenu.assetButtons, 0.2, true);
            }
        }
    }

    private _addButtonPressed(_:unknown, addObjectButton: ObjectButton): void {
        this._categoriesMenu.show();
        this._currentAddObjectButton = addObjectButton;
        this._hideAddObjectButtons();
        if (this._isFirstTime) {
            this._tutorialHand.cancelTutorial();
            this._tutorialHand.showTutorialObjects(this._categoriesMenu.categoryButtons, 0.5, true);
        }
    }

    private _createAddButtons(): void {
        for (let i = 0; i < this._buttonsConfig.addButtons.length; i++) {
            const buttonConfig: AddButtonConfig = this._buttonsConfig.addButtons[i];
            const button: ObjectButton = new ObjectButton(buttonConfig);
            button.alpha = 0;
            this._addButtons.push(button);
            this.addChild(button);
        }
    }

    private _createCategoriesMenu(): void {
        this._categoriesMenu = new CategoriesMenu(this._buttonsConfig.categoryMenuConfig);
        this.addChild(this._categoriesMenu);
    }

    private _createAssetsMenu(): void {

        this._buttonsConfig.assetsMenusConfig.forEach((menuConfig) => {
            const assetsMenu = new AssetsMenu(menuConfig);
            this.addChild(assetsMenu);
            this._assetsMenus.push(assetsMenu);
        });
    }

    public resize(width: number, height: number): void {
        for (const button of this._addButtons) {
            button.scaler.resize(width, height);
        }

        for (const menu of this._assetsMenus) {
            menu.scaler.resize(width, height);
        }

        this._dayButton.scaler.resize(width, height);
        this._categoriesMenu.scaler.resize(width, height);
        this._tutorialHand.resize(width, height);
    }

    private _hideScreens(): void {
        this._categoriesMenu.isActive && this._categoriesMenu.hide();
        this._currentAssetMenu && this._currentAssetMenu.isActive && this._currentAssetMenu.hide();
        this._currentAssetMenu = undefined;

        if (this._currentAddObjectButton) {
            this._currentAddObjectButton.isActive = false;
            this._currentAddObjectButton = undefined;
        }

        if (this._isFirstTime) {
            this._isFirstTime = false;
            this._tutorialHand.cancelTutorial();
        }
        this.showAddObjectButtons(0.3);
        
    }    






}