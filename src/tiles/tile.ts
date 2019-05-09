import { entity } from "../game";

export type TileType = "yourbusiness" | "empty" | "busyroad" | "road" | "house" | "apartment" | "smallbusiness" | "shoppingcenter" | "downtown" | "water" | "nature";

export interface ITile extends entity {
    type: TileType,

    // tile could also store, what IMAGE it should show.
    construction?: "small" | "medium" | "large",
    image?: string, // for example, different IMAGES for houses, but it should be consistent
}

export type Neighbors = (ITile | undefined)[];

export class Tile {
    public static CountTileTypes(types: TileType[], neighbors: Neighbors): number {
        let count = 0;
        neighbors.forEach(t => {
            if (t && types.includes(t.type)) {
                count++;
            }
        })

        return count;
    }

    public static GetSingleTileExtension(type: TileType, neighbors: Neighbors): string {
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

    
    public static GetMultiTileExtension(types: TileType[], neighbors: Neighbors): string {
        var extension: string[] = [];
        neighbors.forEach(t => {
            if (t && types.indexOf(t.type) >= 0) {
                extension.push("1");
            }
            else {
                extension.push("0");
            }
        });

        return extension.join("_");
    }
}