import { GetImage, SupportedImages } from "../imageManager";
import { ITile, Tile } from "./tile";

export class Road {
    public static GetImage(neighbors: (ITile | undefined)[]): HTMLImageElement {

        var ext = Tile.GetMultiTileExtension(["road", "busyroad"], neighbors);
        console.log("road_" + ext);

        return GetImage(("road_"+ext) as SupportedImages)
         || GetImage("road_1_1_1_1" as SupportedImages);
    }
}