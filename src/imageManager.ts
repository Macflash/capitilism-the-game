import apartment from "./images/apartment.png";
import downtown from "./images/downtown.png";
import tile from "./images/tile.png";
import house from "./images/house.png";
import mall from "./images/mall.png";
import smallbusiness from "./images/store.png";
import shoppingcenter from "./images/mall.png";
import water from "./images/water.png";
import nature from "./images/tree.png";
import busyroad from "./images/busy_4.png";

import road_1_1_1_1 from "./images/road/road_1_1_1_1.png";

import road_1_0_0_0 from "./images/road/road_1_0_0_0.png";
import road_0_1_0_0 from "./images/road/road_0_1_0_0.png";
import road_0_0_1_0 from "./images/road/road_0_0_1_0.png";
import road_0_0_0_1 from "./images/road/road_0_0_0_1.png";

import road_0_1_1_1 from "./images/road/road_0_1_1_1.png";
import road_1_0_1_1 from "./images/road/road_1_0_1_1.png";
import road_1_1_0_1 from "./images/road/road_1_1_0_1.png";
import road_1_1_1_0 from "./images/road/road_1_1_1_0.png";

import road_0_0_1_1 from "./images/road/road_0_0_1_1.png";
import road_0_1_1_0 from "./images/road/road_0_1_1_0.png";
import road_1_1_0_0 from "./images/road/road_1_1_0_0.png";
import road_1_0_0_1 from "./images/road/road_1_0_0_1.png";

import road_1_0_1_0 from "./images/road/road_1_0_1_0.png";
import road_0_1_0_1 from "./images/road/road_0_1_0_1.png";

const Images = {
    tile,
    apartment,
    downtown,
    house,
    mall,
    smallbusiness,
    shoppingcenter,
    busyroad,
    water,
    nature,

    // Basic roads
    road_1_1_1_1,
    road_0_1_1_1,
    road_1_0_1_1,
    road_1_1_0_1,
    road_1_1_1_0,
    road_0_0_1_1,
    road_0_1_1_0,
    road_1_1_0_0,
    road_1_0_0_1,
    road_1_0_1_0,
    road_0_1_0_1,
    road_1_0_0_0,
    road_0_1_0_0,
    road_0_0_1_0,
    road_0_0_0_1,
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
