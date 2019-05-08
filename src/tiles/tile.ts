import { entity } from "../game";

export type TileType = "yourbusiness" | "empty" | "busyroad" | "road" | "house" | "apartment" | "smallbusiness" | "shoppingcenter" | "downtown" | "water" | "nature";

export interface ITile extends entity {
    type: TileType,
}

export type Neighbors = (ITile | undefined)[];

export class Tile {
    public static GetTileExtension(type: TileType, neighbors: Neighbors): string {
        var extension: string[] = [];
        neighbors.forEach(t => {
            if (t && t.type == type) {
                extension.push("1");
            }
            else {
                extension.push("0");
            }
        });

        return extension.join("_");
    }
}