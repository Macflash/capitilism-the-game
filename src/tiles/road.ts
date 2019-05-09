import { GetImage, SupportedImages } from "../imageManager";
import { ITile, Tile } from "./tile";

export class Road {
    public static GetImage(neighbors: (ITile | undefined)[]): HTMLImageElement {

        var ext = Tile.GetMultiTileExtension(["road", "busyroad"], neighbors);

        // if it is a single normal road by busy roads, make it a parking lot?
        if(Tile.CountTileTypes(["busyroad"], neighbors) == 1 && Tile.CountTileTypes(["road"], neighbors) == 0){
            return GetImage("parking_" + Tile.GetSingleTileExtension("busyroad", neighbors));
        }

        return GetImage(("road_"+ext))
         || GetImage("road_1_1_1_1");
    }

}


export class BusyRoad {
    public static GetImage(neighbors: (ITile | undefined)[]): HTMLImageElement {

        var ext = Tile.GetMultiTileExtension(["busyroad", "road"], neighbors);

        // if it is a busy road with no other neighbors... should this even BE a tile??

        return GetImage(("busyroad_"+ext))
         || GetImage("busyroad_1_1_1_1");
    }
}