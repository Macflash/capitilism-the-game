import apartment from "./images/apartment.png";
import downtown from "./images/downtown.png";
import React from "react";

export class ImageManager {
    private images = {
        apartment,
        downtown
    };

    private elements = Object.keys(this.images).map((i: any) => this.createImage(i))

    constructor(){

    }

    private createImage = (name: string): HTMLImageElement =>  {
        var img = document.createElement("img");
        var x = this.images as {[key: string]: string};

        img.src = x[name] as string;
        img.width = 500;
        img.height = 500;

        return img;
    }
}