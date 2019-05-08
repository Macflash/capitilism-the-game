import apartment from "./images/apartment.png";
import downtown from "./images/downtown.png";
import tile from "./images/tile.png";
import house from "./images/house.png";
import mall from "./images/mall.png";
import smallbusiness from "./images/store.png";
import shoppingcenter from "./images/mall.png";
import road from "./images/road_intersection.png";
import road_straight from "./images/road_straight.png";
import water from "./images/water.png";
import nature from "./images/tree.png";
import busyroad from "./images/road_intersection.png";
import road_intersection from "./images/road_intersection.png";

const Images = {
    tile,
    apartment,
    downtown,
    house,
    mall,
    road,
    smallbusiness,
    shoppingcenter,
    busyroad,
    water,
    nature,
    road_straight,
    road_intersection,
}

export class ImageManager {
    private elements: { [key: string]: HTMLImageElement } = {};

    constructor() {
        Object.keys(Images).forEach(i => {
            this.elements[i] = this.createImage(i);
        });
    }

    private createImage = (name: string): HTMLImageElement => {
        var img = document.createElement("img");
        var x = Images as { [key: string]: string };

        img.src = x[name] as string;
        img.width = 500;
        img.height = 500;

        return img;
    }

    public GetImage = (name: string) => {
        return this.elements[name];
    }
}