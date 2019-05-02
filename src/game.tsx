import React from 'react';

interface entity {
    x: number;
    y: number;

    //onDraw: (ctx: CanvasRenderingContext2D) => void;
}

type TileType = "empty" | "busyroad" | "road" | "house" | "apartment" | "smallbusiness" | "shoppingcenter" | "downtown";

interface ITile extends entity {
    type: TileType,
}

export class GameBoard extends React.Component {
    private tileSize = 10;
    private size = 200;
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private allTiles: ITile[] = [];
    private gridTiles: { [key: string]: ITile } = {};

    private getTile = (x: number, y: number): ITile | undefined => {
        return this.gridTiles[x + "," + y];
    }

    private setTile = (x: number, y: number, tile: ITile) => {
        this.gridTiles[x + "," + y] = tile;
    }

    private drawTile = (tile: ITile, ctx: CanvasRenderingContext2D) => {

        // eslint-disable-next-line
        switch (tile.type) {
            case "road":
                ctx.fillStyle = "grey";
                break;
            case "busyroad":
                ctx.fillStyle = "#555";
                break;
            case "house":
                ctx.fillStyle = "brown";
                break;
            case "apartment":
                ctx.fillStyle = "red";
                break;
            case "smallbusiness":
                ctx.fillStyle = "orange";
                break;
            case "shoppingcenter":
                ctx.fillStyle = "yellow";
                break;
            case "downtown":
                ctx.fillStyle = "lightgrey";
                break;
            default:
                ctx.fillStyle = "green";
                break;
        }

        ctx.fillRect(tile.x * this.tileSize, tile.y * this.tileSize, this.tileSize, this.tileSize);
    }

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {};
    }

    private seedRoads = () => {
        var i = Math.floor((this.size * .25) + Math.random() * (this.size * .5));
        var j = Math.floor((this.size * .25) + Math.random() * (this.size * .5));

        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                if (x === j || y === i) {
                    let tile: ITile = { type: "road", x, y };
                    this.allTiles.push(tile);
                    this.setTile(x, y, tile);
                }
            }
        }

        this.getTile(j, i)!.type = "busyroad";
        this.getNeighbors(j, i).forEach(t => {
            if (t) {
                t.type = "busyroad";
            }
        });
    }

    private seedTiles = () => {
        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                if (this.getTile(x, y)) { continue; }

                let type: TileType = "empty";
                /*
                // create a house
                if (Math.random() < .1) {
                    type = "house";
                }
                else if (Math.random() < .01) {
                    type = "smallbusiness";
                }
                else if (Math.random() < .01) {
                    type = "apartment";
                }
                else if (Math.random() < .01) {
                    type = "downtown";
                }
                */
                let tile: ITile = { type, x, y };
                this.allTiles.push(tile);
                this.setTile(x, y, tile);
            }
        }
    }

    private getNeighbors = (x: number, y: number): (ITile | undefined)[] => {
        return [
            this.getTile(x - 1, y),
            this.getTile(x - 1, y - 1),
            this.getTile(x, y - 1),
            this.getTile(x + 1, y - 1),
            this.getTile(x + 1, y),
            this.getTile(x + 1, y + 1),
            this.getTile(x, y + 1),
            this.getTile(x - 1, y + 1),
        ];
    }

    private getTypes = (tiles: (ITile | undefined)[]): { [types: string]: number } => {
        var counts: { [types: string]: number } = {
            busyroad: 0,
            road: 0,
            house: 0,
            apartment: 0,
            shoppingcenter: 0,
            smallbusiness: 0,
            downtown: 0,
            empty: 0,
        };

        tiles.forEach(t => {
            if (t) {
                counts[t.type] = counts[t.type] || 0;
                counts[t.type]++;
            }
        })

        return counts;
    }

    private updateTiles = () => {
        // eslint-disable-next-line
        for (var tile of this.allTiles) {
            var neighbors = this.getNeighbors(tile.x, tile.y);
            var counts = this.getTypes(neighbors);
            var initialType = tile.type;
            switch (tile.type) {
                case "empty":
                    if(counts["busyroad"] > 2){
                        if(Math.random() < .025){
                            tile.type = "downtown";
                        }
                    }

                    if (counts["road"] == 1) {
                        // only straight for now...
                        if ((neighbors[0] && neighbors[0]!.type == "road")
                            || (neighbors[2] && neighbors[2]!.type == "road")
                            || (neighbors[4] && neighbors[4]!.type == "road")
                            || (neighbors[6] && neighbors[6]!.type == "road")
                        ) {
                            if (Math.random() < .1) {
                                tile.type = "road";
                            }
                        }
                    }

                    if (counts["road"] == 2 && !(counts["house"] >= 2)) {
                        if (Math.random() < .05) {
                            tile.type = "house";
                        }
                    }

                    if (counts["road"] + counts["busyroad"] == 3) {
                        if (Math.random() < .1) {
                            tile.type = "road";
                        }

                        else if (Math.random() < ((counts["house"] >= 2) ? .05 : .1)) {
                            tile.type = "house";
                        }

                        else if (Math.random() < .1) {
                            tile.type = "smallbusiness";
                        }
                    }

                    if (counts["road"] > 5) {
                        if (Math.random() < .01) {
                            tile.type = "downtown";
                        }
                        else if (Math.random() < .1) {
                            tile.type = "apartment";
                        }
                    }
                    if (counts["downtown"] > 0) {
                        if (counts["road"] > 2 || counts["busyroad"] >= 1) {
                            if (Math.random() < .01) {
                                tile.type = "downtown";
                            }
                        }
                        else {
                            if (Math.random() < .001) {
                                tile.type = "downtown";
                            }
                        }
                    }

                    break;
                case "smallbusiness":
                    if (counts["busyroad"] > 0) {
                        if (Math.random() < .01) {
                            tile.type = "shoppingcenter";
                        }
                    }

                    else if (!counts["smallbusiness"] && !counts["apartment"]) {
                        if (Math.random() < .01) {
                            tile.type = "empty";
                        }
                    }

                    else if (counts["smallbusiness"] >= 1) {
                        if (Math.random() < .05) {
                            tile.type = "empty";
                        }
                    }

                    if (counts["road"] == 5 && !(counts["house"] > 0)) {
                        if (Math.random() < .1) {
                            tile.type = "shoppingcenter";
                        }
                    }

                    break;

                case "house":
                    if (counts["house"] > 2) {
                        if (Math.random() < .1) {
                            tile.type = "apartment";
                        }
                    }

                    else if (counts["downtown"] > 0) {
                        if (Math.random() < .1) {
                            tile.type = "empty";
                        }
                    }

                    else if (counts["busyroad"] > 0) {
                        if (Math.random() < .1) {
                            tile.type = "empty";
                        }
                        else if (Math.random() < .1) {
                            tile.type = "apartment";
                        }
                    }

                    break;

                case "road":
                    if (counts["downtown"] >= 1) {
                        if (Math.random() < .01) {
                            tile.type = "busyroad";
                        }
                    }
                    if (counts["busyroad"] == 1) {
                        // only straight lines
                        if ((neighbors[0] && neighbors[0]!.type == "busyroad")
                            || (neighbors[2] && neighbors[2]!.type == "busyroad")
                            || (neighbors[4] && neighbors[4]!.type == "busyroad")
                            || (neighbors[6] && neighbors[6]!.type == "busyroad")
                        ) {
                            if (Math.random() < .05) {
                                tile.type = "busyroad";
                            }
                        }
                    }

                    break;

                case "downtown":
                    if (counts["empty"] > 3) {
                        if (Math.random() < .1) {
                            tile.type = "empty";
                        }
                    }

                    break;
            }

            if (tile.type != initialType) {
                this.drawTile(tile, this.ctx!);
            }
        }
    }

    private drawAllTiles = () => {
        this.allTiles.forEach(i => this.drawTile(i, this.ctx!));
    }

    private runStep = () => {
        this.updateTiles();

        //this.ctx!.clearRect(0, 0, this.size, this.size);
        //this.allTiles.forEach(i => this.drawTile(i, this.ctx!));

        setTimeout(this.runStep, 25);
    }

    render() {
        var realSize = this.size * this.tileSize;
        return <canvas
            width={realSize.toString()}
            height={realSize.toString()}
            style={{ height: realSize + "px", width: realSize + "px" }} ref={c => {
                if (!this.canvas && c) {
                    this.canvas = c;
                    this.ctx = this.canvas!.getContext("2d");

                    this.seedRoads();
                    this.seedTiles();
                    this.drawAllTiles();

                    setTimeout(this.runStep, 50);
                }
            }} />;
    }
}