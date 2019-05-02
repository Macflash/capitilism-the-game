import React from 'react';

interface entity {
    x: number;
    y: number;

    //onDraw: (ctx: CanvasRenderingContext2D) => void;
}

type TileType = "empty" | "busyroad" | "road" | "house" | "apartment" | "smallbusiness" | "shoppingcenter" | "downtown" | "water" | "nature";

interface ITile extends entity {
    type: TileType,
}

export class GameBoard extends React.Component {
    private tileSize = 10;

    private currentSteps = 0;
    private generationSteps = 100;

    /** Starting size */
    private size = 50;

    private scale = 1;
    private centerX = this.size / 2;
    private centerY = this.size / 2;
    private canvasSize = 800;

    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private allTiles: ITile[] = [];
    private newTiles: ITile[] = [];
    private gridTiles: { [key: string]: ITile } = {};

    private getTile = (x: number, y: number, addMissing: boolean): ITile | undefined => {
        var tile = this.gridTiles[x + "," + y];
        if (!tile && addMissing) {
            tile = { x, y, type: "empty" };
            this.setTile(x, y, tile);
        }

        return tile;
    }

    private setTile = (x: number, y: number, tile: ITile) => {
        if (!this.gridTiles[x + "," + y]) {
            this.newTiles.push(tile);
        }

        this.gridTiles[x + "," + y] = tile;
    }

    private drawTile = (tile: ITile, ctx: CanvasRenderingContext2D) => {
        // eslint-disable-next-line
        switch (tile.type) {
            case "water":
                ctx.fillStyle = "blue";
                break;
            case "nature":
                ctx.fillStyle = "darkgreen";
                break;
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

        var vTileSize = this.tileSize * this.scale;
        var vTileX = ((tile.x - this.centerX)) * vTileSize + (this.canvasSize / 2);
        var vTileY = ((tile.y - this.centerY)) * vTileSize + (this.canvasSize / 2);

        ctx.fillRect(
            Math.floor(vTileX),
            Math.floor(vTileY),
            Math.ceil(vTileSize),
            Math.ceil(vTileSize));
    }

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {};
    }

    private seedWater = () => {
        for (var x = this.size * -.5; x < this.size * 1.5; x++) {
            for (var y = this.size * -.5; y < this.size * 1.5; y++) {
                if(Math.random() < .002){
                    this.setTile(x,y, {x,y, type: "water"});
                    this.getNeighbors(x,y,true);
                }
            }
        }
        this.addNewTiles();

        for(var i = 0; i < 5; i++){
            this.allTiles.forEach(x => {
                if(x.type=="empty"){
                    var neighbors = this.getNeighbors(x.x, x.y, true);
                    var counts = this.getTypes(neighbors);
    
                    if(counts["water"] > 2){
                        if(Math.random() < .33){
                            x.type = "water";
                        }
                    }
                    else if(counts["water"] > 1){
                        if(Math.random() < .25){
                            x.type = "water";
                        }
                    }
                    else if(Math.random() < .05){
                        x.type = "water";
                    }
                }
            });

            this.addNewTiles();
        }
    }

    private seedNature = () => {
        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                if(!this.getTile(x,y, false)){
                    if(Math.random() < .005){
                        this.setTile(x,y, {x,y, type: "nature"});
                        this.getNeighbors(x,y,true);
                    }
                }
            }
        }

        this.addNewTiles();

        for(var i = 0; i < 7; i++){
            this.allTiles.forEach(x => {
                if(x.type=="empty"){
                    var neighbors = this.getNeighbors(x.x, x.y, true);
                    var counts = this.getTypes(neighbors);
    
                    if(counts["water"] > 2 || counts["nature"] > 2){
                        if(Math.random() < .33){
                            x.type = "nature";
                        }
                    }
                    else if(Math.random() < .05){
                        x.type = "nature";
                    }
                }
            });

            this.addNewTiles();
        }
    }

    private seedRoads = () => {
        var i = Math.floor((this.size * .25) + Math.random() * (this.size * .25));
        var j = Math.floor((this.size * .25) + Math.random() * (this.size * .25));
        var i2 = Math.floor((i + this.size / 7) + Math.random() * (this.size * .5));
        var j2 = Math.floor((j + this.size / 7) + Math.random() * (this.size * .5));
        console.log(i + ","+ j);
        console.log(i2 + ","+ j2);

        this.centerX = j;
        this.centerY = i;

        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                if (x === j || y === i || x === j2 || y === i2) {
                    let tile: ITile = { type: "road", x, y };

                    var existingtile = this.getTile(x,y,false);
                    if(existingtile){
                        existingtile.type = "road";
                    }
                    else{
                        this.setTile(x, y, tile);
                    }
                }
            }
        }

        this.getTile(j, i, false)!.type = "busyroad";
        this.getNeighbors(j, i, false).forEach(t => {
            if (t) {
                t.type = "busyroad";
            }
        });
    }

    private getNeighbors = (x: number, y: number, addMissing: boolean): (ITile | undefined)[] => {
        return [
            this.getTile(x - 1, y, addMissing),
            this.getTile(x - 1, y - 1, addMissing),
            this.getTile(x, y - 1, addMissing),
            this.getTile(x + 1, y - 1, addMissing),
            this.getTile(x + 1, y, addMissing),
            this.getTile(x + 1, y + 1, addMissing),
            this.getTile(x, y + 1, addMissing),
            this.getTile(x - 1, y + 1, addMissing),
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
            any: 0,
        };

        tiles.forEach(t => {
            if (t) {
                counts[t.type] = counts[t.type] || 0;
                counts[t.type]++;
                if(t.type != "empty" && t.type != "water" && t.type != "nature"){
                    counts["any"]++;
                }
            }
            else {
                counts["empty"]++;
            }
        })

        return counts;
    }

    private updateTiles = () => {
        // eslint-disable-next-line
        for (var tile of this.allTiles) {
            var neighbors = this.getNeighbors(tile.x, tile.y, tile.type != "empty");
            var counts = this.getTypes(neighbors);

            var initialType = tile.type;
            switch (tile.type) {
                case "nature":
                // slowly clear nature if devloped nearby?
                if(counts["any"] >= 1){
                    if(Math.random() < .1){
                        tile.type = "empty";
                    }
                }
                case "empty":
                    if (counts["busyroad"] > 2) {
                        if (Math.random() < .025) {
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
                            if (Math.random() < .15) {
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

    private addNewTiles = () => {
        this.allTiles = this.allTiles.concat(this.newTiles);
        this.newTiles = [];
    }

    private runStep = () => {
        this.updateTiles();
        this.addNewTiles();

        if(this.currentSteps < this.generationSteps){
            this.currentSteps++;
            setTimeout(this.runStep, 50);
        }
        else{
            console.log("done!");
        }
    }

    private clearMap = () => {
        this.ctx!.fillStyle = "green";
        this.ctx!.fillRect(0, 0, this.canvasSize, this.canvasSize);
        this.drawAllTiles();
    }

    private dragging = false;
    private startX = 0;
    private startY = 0;

    render() {
        var realSize = this.size * this.tileSize;
        return <div>
            <div>
                <button onClick={() => { setTimeout(this.runStep, 50); }}>STEP</button>
                <button onClick={() => { this.scale *= 1.1; this.clearMap(); }}>+</button>
                <button onClick={() => { this.scale *= .9; this.clearMap(); }}>-</button>
            </div>
            <canvas
                onMouseDown={ev => { this.dragging = true; this.startX = ev.screenX; this.startY = ev.screenY; }}
                onMouseUp={ev => { this.dragging = false; }}
                onMouseMove={ev => {
                    if (this.dragging) {
                        this.centerX += (this.startX - ev.screenX) / (this.scale * this.tileSize);
                        this.centerY += (this.startY - ev.screenY) / (this.scale * this.tileSize);
                        this.startX = ev.screenX; this.startY = ev.screenY;
                        this.clearMap();
                    }
                }}
                width={this.canvasSize.toString()}
                height={this.canvasSize.toString()}
                style={{ height: this.canvasSize + "px", width: this.canvasSize + "px" }} ref={c => {
                    if (!this.canvas && c) {
                        this.canvas = c;
                        this.ctx = this.canvas!.getContext("2d");

                        this.seedWater();
                        this.seedNature();

                        this.seedRoads();
                        this.addNewTiles();
                        this.clearMap();

                        setTimeout(this.runStep, 50);
                    }
                }} />
        </div>;
    }
}