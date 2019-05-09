import { ITile } from "./tile";
import { tsLiteralType } from "@babel/types";

export type CunstructionStep = "small" | "medium" | "large";


export class Construction {
    public static BuildNewTile(tile: ITile): void {
        if (tile.type != "empty" && tile.type != "nature" && tile.type != "water") {
            tile.construction = "small";
        }
    }
    
    public static UpdateTileConstruction(tile: ITile): void {
        if (!tile.construction) { return; }
        var max: CunstructionStep = "small";
        switch (tile.type) {
            case "apartment":
            case "shoppingcenter":
                max = "medium";
                break;
            case "downtown":
                max = "large";
                break;
        }

        // construction is finished
        if(tile.construction == max){
            tile.construction = undefined;
        }
        else if(tile.construction == "small"){
            tile.construction = "medium";
        }
        else if(tile.construction == "medium"){
            tile.construction = "large";
        }
    }
}