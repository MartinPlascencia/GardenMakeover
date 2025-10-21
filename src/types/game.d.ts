
type ButtonsConfig = {
    addButtons: AddButtonConfig[],
    categoryMenuConfig: CategoryMenuConfig,
    assetsMenusConfig: AssetMenuConfig[],
    dayButtonConfig: UIAssetConfig,
    downloadButtonConfig: UIAssetConfig,
}

type UIAssetConfig = {
    portraitPosition: {x: number, y: number},
    portraitSize: {x: number, y: number},
    landscapePosition: {x: number, y: number},
    landscapeSize: {x: number, y: number},
}

type AddButtonConfig = {
    uiAssetConfig: UIAssetConfig,
    objectPosition: {x: number, y: number, z: number},
    buttonTexture: string,
}

type CategoryMenuConfig = {
    categoryButtons: CategoryButtonConfig[],
    uiAssetConfig: UIAssetConfig,
    buttonsData: ButtonsData,
}

type ButtonsData = {
    buttonSpacing: number,
    buttonSize: {x: number, y: number},
}

type CategoryButtonConfig = {
    categoryName: string,
    font: string,
    fontSize: number,
    buttonTexture: string,
}

type AssetMenuConfig = {
    uiAssetConfig: UIAssetConfig,
    buttonsConfig: AssetButtonConfig[],
    buttonsData: ButtonsData,
    tag: string
}

type AssetButtonConfig = {
    textureName: string,
    modelData: ModelData,
}

type ModelData = {
    modelName: string,
    parentName?: string,
    animationName?: string,
    scale: number,
    soundName: string,
}

export { ButtonsConfig, UIAssetConfig, AddButtonConfig, CategoryMenuConfig, CategoryButtonConfig, AssetMenuConfig, AssetButtonConfig, ModelData };