import apartment from "./images/apartment.png";
import downtown from "./images/downtown.png";
import tile from "./images/tile.png";
import house from "./images/house.png";
import mall from "./images/mall.png";
import smallbusiness from "./images/store.png";
import shoppingcenter from "./images/mall.png";
import water from "./images/water.png";
import nature from "./images/tree.png";
import yourbusiness from "./images/yourbusiness.png";

// construction
import construction_small from "./images/construction/construction_small.png";
import construction_medium from "./images/construction/construction_medium.png";
import construction_large from "./images/construction/construction_large.png";

// transitions
import transitionroad_1_0_0_0 from "./images/transitionroad/transitionroad_1_0_0_0.png";
import transitionroad_0_1_0_0 from "./images/transitionroad/transitionroad_0_1_0_0.png";
import transitionroad_0_0_1_0 from "./images/transitionroad/transitionroad_0_0_1_0.png";
import transitionroad_0_0_0_1 from "./images/transitionroad/transitionroad_0_0_0_1.png";


import car from "./images/car.png";

import { Roads } from "./images/road";
import { BusyRoads } from "./images/busyroad";
import { Waters } from "./images/water";
import { Cars } from "./images/car";



const Images = {
    ...Roads,
    ...BusyRoads,
    ...Waters,
    ...Cars,

    yourbusiness,
    car,
    tile,
    apartment,
    downtown,
    house,
    mall,
    smallbusiness,
    shoppingcenter,
    water,
    nature,

    //construction
    construction_small,
    construction_medium,
    construction_large,

    transitionroad_1_0_0_0,
    transitionroad_0_1_0_0,
    transitionroad_0_0_1_0,
    transitionroad_0_0_0_1,
}

const elements: { [key: string]: HTMLImageElement } = {};

export class ImageManager {
    constructor() {
    }

    public static createImage = (name: string): HTMLImageElement => {
        var img = document.createElement("img");
        var x = Images as { [key: string]: string };

        img.src = x[name] as string;
        img.width = 500;
        img.height = 500;

        return img;
    }

    public GetImage = (name: string) => {
        return elements[name];
    }
}

Object.keys(Images).forEach(i => {
    elements[i] = ImageManager.createImage(i);
});

export type SupportedImages =
    "tile" |
    "apartment" |
    "downtown" |
    "house" |
    "mall" |
    "smallbusiness" |
    "shoppingcenter" |
    "busyroad" |
    "water" |
    "nature";

export const GetImage = (name: SupportedImages) => {
    return elements[name];
}
