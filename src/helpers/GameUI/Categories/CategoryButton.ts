import { Container, Text, Sprite, Assets } from "pixi.js";
import { CategoryButtonConfig } from "../../../types/game";
import PlaneBasicAnimations from "../../../utils/PlaneBasicAnimations";

import eventsSystem from "../../../utils/EventsSystem";

export default class CategoryButton extends Container {
    private _name: string;
    constructor(categoryButtonConfig: CategoryButtonConfig) {
        super();

        this._name = categoryButtonConfig.categoryName;
        const categoryButton = new Container();
        this.addChild(categoryButton);

        const categoryButtonImage = new Sprite(Assets.get(categoryButtonConfig.buttonTexture));
        categoryButtonImage.anchor.set(0.5);
        categoryButton.addChild(categoryButtonImage);

        const categoryText = new Text(categoryButtonConfig.categoryName, {
            fontFamily: categoryButtonConfig.font,
            fontSize: categoryButtonConfig.fontSize,
            fill: 0xffffff,
            align: 'center',
        });
        categoryText.y-= categoryButtonImage.height * 0.05;
        categoryText.anchor.set(0.5);
        categoryButton.addChild(categoryText);

        categoryButton.eventMode = 'static';
        categoryButton.cursor = 'pointer';
        categoryButton.on('pointerdown', this._onButtonPressed.bind(this));
    }

    private _onButtonPressed(): void {
        PlaneBasicAnimations.animateButton(this);
        eventsSystem.emit('categoryButtonPressed', this._name);
    }
}