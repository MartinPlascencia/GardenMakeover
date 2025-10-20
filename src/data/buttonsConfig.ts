export default {
    dayButtonConfig: {
        portraitPosition: {x: 0.85, y: 0.08},
        portraitSize: {x: 0.2, y: 0.1},
        landscapePosition: {x: 0.9, y: 0.1},
        landscapeSize: {x: 0.1, y: 0.2},
    },
    addButtons: [
        {
            uiAssetConfig: {
                portraitPosition: {x: 0.5, y: 0.5},
                portraitSize: {x: 0.1, y: 0.2},
                landscapePosition: {x: 0.5, y: 0.5},
                landscapeSize: {x: 0.1, y: 0.1},
            },
            buttonTexture: 'object_button',
            objectPosition: {x: 0, y: 3, z: 3},
        },
        {
            uiAssetConfig: {
                portraitPosition: {x: 0.45, y: 0.4},
                portraitSize: {x: 0.1, y: 0.2},
                landscapePosition: {x: 0.45, y: 0.4},
                landscapeSize: {x: 0.1, y: 0.1},
            },
            buttonTexture: 'object_button',
            objectPosition: {x: -1, y: 3, z: -1},
        },
        {
            uiAssetConfig: {
                portraitPosition: {x: 0.3, y: 0.42},
                portraitSize: {x: 0.1, y: 0.2},
                landscapePosition: {x: 0.3, y: 0.42},
                landscapeSize: {x: 0.1, y: 0.1},
            },
            buttonTexture: 'object_button',
            objectPosition: {x: -4, y: 3, z: 0},
        },
        {
            uiAssetConfig: {
                portraitPosition: {x: 0.7, y: 0.5},
                portraitSize: {x: 0.1, y: 0.2},
                landscapePosition: {x: 0.7, y: 0.5},
                landscapeSize: {x: 0.1, y: 0.1},
            },
            buttonTexture: 'object_button',
            objectPosition: {x: 4, y: 3, z: 3},
        }
    ],
    categoryMenuConfig: {
        buttonsData: {
            buttonSpacing: 225,
            buttonSize: {x: 200, y: 80},
        },
        categoryButtons: [
            {
                categoryName: 'Plants',
                font: 'grobold',
                buttonTexture: 'category_button',
                fontSize: 80,
            },
            {
                categoryName: 'Animals',
                font: 'grobold',
                buttonTexture: 'category_button',
                fontSize: 80,

            },
            {
                categoryName: 'Buildings',
                font: 'grobold',
                buttonTexture: 'category_button',
                fontSize: 80,
            }
        ],
        uiAssetConfig: {
            portraitPosition: {x: 0.5, y: 0.75},
            portraitSize: {x: 0.7, y: 0.12},
            landscapePosition: {x: 0.5, y: 0.72},
            landscapeSize: {x: 0.8, y: 0.15},
        },
    },
    assetsMenusConfig: [
        {
            tag: 'Plants',
            uiAssetConfig: {
                portraitPosition: {x: 0.5, y: 0.9},
                portraitSize: {x: 0.7, y: 0.15},
                landscapePosition: {x: 0.5, y: 0.9},
                landscapeSize: {x: 0.8, y: 0.15},
            },
            buttonsData: {
                buttonSpacing: 150,
                buttonSize: {x: 100, y: 100},
            },
            buttonsConfig: [
                {
                    textureName: 'corn',
                    modelData: {
                        modelName: 'corn_3',
                        parentName: 'objects',
                        scale: 0.8,
                        soundName: 'plant_growing_1'
                    }
                },
                {
                    textureName: 'strawberry',
                    modelData: {
                        modelName: 'strawberry_3',
                        parentName: 'objects',
                        scale: 0.8,
                        soundName: 'plant_growing_2'
                    }
                },
                {
                    textureName: 'grape',
                    modelData: {
                        modelName: 'grape_3',
                        parentName: 'objects',
                        scale: 0.8,
                        soundName: 'plant_growing_3'
                    }
                },
                {
                    textureName: 'tomato',
                    modelData: {
                        modelName: 'tomato_3',
                        parentName: 'objects',
                        scale: 0.8,
                        soundName: 'plant_growing_1'
                    }
                    
                }
            ]
        },
        {
            tag: 'Animals',
            uiAssetConfig: {
                portraitPosition: {x: 0.5, y: 0.9},
                portraitSize: {x: 0.7, y: 0.15},
                landscapePosition: {x: 0.5, y: 0.9},
                landscapeSize: {x: 0.8, y: 0.15},
            },
            buttonsData: {
                buttonSpacing: 150,
                buttonSize: {x: 100, y: 100},
            },
            buttonsConfig: [
                {
                    textureName: 'cow',
                    modelData: {
                        modelName: 'cow_1',
                        parentName: 'objects',
                        animationName: 'action_cow',
                        scale: 0.6, 
                        soundName: 'cow'
                    }
                    
                },
                {
                    textureName: 'sheep',
                    modelData: {
                        modelName: 'sheep_1',
                        parentName: 'objects',
                        animationName: 'action_sheep',
                        scale: 0.8,
                        soundName: 'sheep'
                    }
                },
                {
                    textureName: 'chicken',
                    modelData: {
                        modelName: 'chicken_1',
                        parentName: 'objects',
                        animationName: 'action_chicken',
                        scale: 1,
                        soundName: 'chicken'
                    }
                }
            ]
        },
        {
            tag: 'Buildings',
            uiAssetConfig: {
                portraitPosition: {x: 0.5, y: 0.9},
                portraitSize: {x: 0.7, y: 0.15},
                landscapePosition: {x: 0.5, y: 0.9},
                landscapeSize: {x: 0.8, y: 0.15},
            },
            buttonsData: {
                buttonSpacing: 150,
                buttonSize: {x: 100, y: 100},
            },
            buttonsConfig: [
                {
                    textureName: 'fence',
                    modelData: { 
                        modelName: 'fence',
                        parentName: 'objects',
                        scale: 0.35,
                        soundName: 'building'
                    }
                }
            ]
        },
    ],
}