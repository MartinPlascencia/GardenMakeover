export default {
    bundles: [
        {
            name: "load-screen",
            assets: [
                { alias: "progress_bar", src: "sprites/progress_bar.png" },
                { alias: "progress_bar_fill", src: "sprites/progress_bar_fill.png" }
            ]
        },
        {
            name: "game-screen",
            assets: [
                { alias: "object_button", src: "sprites/plus-button.png" },
                { alias: "category_button", src: "sprites/category_button.png" },
                { alias: "strawberry", src: "sprites/strawberry.png" },
                { alias: "tomato", src: "sprites/tomato.png" },
                { alias: "corn", src: "sprites/corn.png" },
                { alias: "grape", src: "sprites/grape.png" },
                { alias: "cow", src: "sprites/cow.png" },
                { alias: "chicken", src: "sprites/chicken.png" },
                { alias: "sheep", src: "sprites/sheep.png" },
                { alias: "day_button", src: "sprites/day_button.png" },
                { alias: "night_button", src: "sprites/night_button.png" },
                { alias: "hand", src: "sprites/hand.png" },
                { alias: "fence", src: "sprites/fence.png" },
                { alias: "cloud", src: "sprites/cloud.png" },
                { alias: "farm_ground", src: "sprites/farm_ground.png"},
                { alias: "download_button", src: "sprites/play_button.png" }
            ]
        }
    ],
    models: [
        { alias: "ground", src: "models/ground2.glb" },
        { alias: "objects", src: "models/objects2.glb" }
    ],
    fonts: [
        { alias: "grobold", src: "fonts/grobold.ttf" }
    ],
    sounds: [
        { alias: "theme", src: "sounds/theme.mp3" },
        { alias: "rooster", src: "sounds/rooster.mp3" },
        { alias: "irons", src: "sounds/irons.mp3" },
        { alias: "sheep", src: "sounds/sheep.mp3" },
        { alias: "cow", src: "sounds/cow.mp3" },
        { alias: "chicken", src: "sounds/chicken.mp3" },
        { alias: "plant_growing_1", src: "sounds/plant_growing_1.mp3" },
        { alias: "plant_growing_2", src: "sounds/plant_growing_2.mp3" },
        { alias: "plant_growing_3", src: "sounds/plant_growing_3.mp3" },
        { alias: "click", src: "sounds/pop.mp3" },
        { alias: "category_button", src: "sounds/bucket.mp3" },
        { alias: "place_object", src: "sounds/collect_moon.mp3" },
        { alias: "pop_button", src: "sounds/click2.mp3" },
        { alias: "click_add", src: "sounds/click_add.mp3" },
        { alias: "building", src: "sounds/building.mp3" }
    ],
    textures: [
        { alias: "smoke", src: "textures/smoke.png" }
    ]
};
