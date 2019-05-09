import { GetImage, SupportedImages } from "../imageManager";
import { ITile, Tile } from "./tile";

export class Road {
    public static GetImage(neighbors: (ITile | undefined)[]): HTMLImageElement {

        var ext = Tile.GetMultiTileExtension(["road", "busyroad"], neighbors);

        // if it is a single normal road by busy roads, make it a parking lot?

        return GetImage(("road_"+ext) as SupportedImages)
         || GetImage("road_1_1_1_1" as SupportedImages);
    }

}


export class BusyRoad {
    public static GetImage(neighbors: (ITile | undefined)[]): HTMLImageElement {

        var ext = Tile.GetMultiTileExtension(["busyroad", "road"], neighbors);

        // if it is a busy road with no other neighbors... should this even BE a tile??

        return GetImage(("busyroad_"+ext) as SupportedImages)
         || GetImage("busyroad_1_1_1_1" as SupportedImages);
    }

    public static AddTransitions(tile: ITile, neighbors: (ITile | undefined)[], ctx: CanvasRenderingContext2D): void {
        if(tile.type == "road"){
            var converted = this.convertToScreenSpace(tile, 0, 0);
            var ext = Tile.GetSingleTileExtension("busyroad", t);

            if(neighbors[0] && neighbors[0]!.type == "busyroad"){
                ctx.drawImage(img, converted.x, converted.y, converted.tileSize, converted.tileSize);
            }

            if(ext != "0_0_0_0"){
                var img = GetImage("transitionroad_" + ext);
                if(img){
                    ctx.drawImage(img, converted.x, converted.y, converted.tileSize, converted.tileSize);
                }
            }
        }
    }

}