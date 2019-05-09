import React from 'react';
import { ImageManager } from './imageManager';
import { Road, BusyRoad } from './tiles/road';
import { ITile, Tile, TileType } from './tiles/tile';
import { Construction } from './tiles/construction';

export interface entity {
    x: number;
    y: number;

    //onDraw: (ctx: CanvasRenderingContext2D) => void;
}

interface IBusiness extends ITile {
    range: number,
    good: "Food" | "Coffee" | "Gas",
}

type UnitType = "person" | "car";

interface IUnit extends entity {
    type: UnitType;

    direction?: string;
    nextTile?: ITile;
    lastTile: ITile;
}

export class GameBoard extends React.Component {
    private tileSize = 10;
    private money = 100;

    private currentSteps = 0;
    private generationSteps = 100;

    /** Starting size */
    private size = 50;

    private scale = 5;
    private centerX = this.size / 2;
    private centerY = this.size / 2;
    private canvasSize = 800;

    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private allTiles: ITile[] = [];
    private newTiles: ITile[] = [];
    private gridTiles: { [key: string]: ITile } = {};

    private allUnits: IUnit[] = [];

    private minTile = 0;
    private maxTile = 0;

    private imageManager = new ImageManager();

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

            //Construction.BuildNewTile(tile);

            this.newTiles.push(tile);

            if (x > this.maxTile) { this.maxTile = x; }
            if (y > this.maxTile) { this.maxTile = y; }
            if (x < this.minTile) { this.minTile = x; }
            if (y < this.minTile) { this.minTile = y; }
        }

        this.gridTiles[x + "," + y] = tile;
    }

    private drawTile = (tile: ITile, ctx: CanvasRenderingContext2D) => {
        var t = this.getCloseNeighbors(tile.x, tile.y, false);

        let image = this.imageManager.GetImage(tile.type + "_" + Tile.GetSingleTileExtension(tile.type, t))
            || this.imageManager.GetImage(tile.type);
        switch (tile.type) {
            case "yourbusiness":
                ctx.fillStyle = "purple";
                break;
            case "water":
                ctx.fillStyle = "blue";
                break;
            case "nature":
                ctx.fillStyle = "darkgreen";
                break;
            case "road":
                image = Road.GetImage(t);
                ctx.fillStyle = "grey";
                break;
            case "busyroad":
                image = BusyRoad.GetImage(t);
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

        if (tile.construction) {
            image = this.imageManager.GetImage("construction_" + tile.construction);
        }

        var converted = this.convertToScreenSpace(tile, 0, 0);

        /*
        ctx.fillRect(
            Math.floor(vTileX),
            Math.floor(vTileY),
            Math.ceil(vTileSize),
            Math.ceil(vTileSize)
        );*/

        if (image) {
            ctx.drawImage(image, converted.x, converted.y, converted.tileSize, converted.tileSize);

            // more road stuff?
            if(tile.type == "road"){
                if(t[0] && t[0]!.type == "busyroad"){
                    ctx.drawImage(this.imageManager.GetImage("transitionroad_1_0_0_0"), converted.x, converted.y, converted.tileSize, converted.tileSize);
                }
                if(t[1] && t[1]!.type == "busyroad"){
                    ctx.drawImage(this.imageManager.GetImage("transitionroad_0_1_0_0"), converted.x, converted.y, converted.tileSize, converted.tileSize);
                }
                if(t[2] && t[2]!.type == "busyroad"){
                    ctx.drawImage(this.imageManager.GetImage("transitionroad_0_0_1_0"), converted.x, converted.y, converted.tileSize, converted.tileSize);
                }
                if(t[3] && t[3]!.type == "busyroad"){
                    ctx.drawImage(this.imageManager.GetImage("transitionroad_0_0_0_1"), converted.x, converted.y, converted.tileSize, converted.tileSize);
                }
            }
        }
    }

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {};
    }

    private seedWater = () => {
        for (var x = this.size * -.5; x < this.size * 1.5; x++) {
            for (var y = this.size * -.5; y < this.size * 1.5; y++) {
                if (Math.random() < .002) {
                    this.setTile(x, y, { x, y, type: "water" });
                    this.getNeighbors(x, y, true);
                }
            }
        }
        this.addNewTiles();

        for (var i = 0; i < 5; i++) {
            this.allTiles.forEach(x => {
                if (x.type == "empty") {
                    var neighbors = this.getNeighbors(x.x, x.y, true);
                    var counts = this.getTypes(neighbors);

                    if (counts["water"] > 2) {
                        if (Math.random() < .33) {
                            x.type = "water";
                        }
                    }
                    else if (counts["water"] > 1) {
                        if (Math.random() < .25) {
                            x.type = "water";
                        }
                    }
                    else if (Math.random() < .05) {
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
                if (!this.getTile(x, y, false)) {
                    if (Math.random() < .005) {
                        this.setTile(x, y, { x, y, type: "nature" });
                        this.getNeighbors(x, y, true);
                    }
                }
            }
        }

        this.addNewTiles();

        for (var i = 0; i < 7; i++) {
            this.allTiles.forEach(x => {
                if (x.type == "empty") {
                    var neighbors = this.getNeighbors(x.x, x.y, true);
                    var counts = this.getTypes(neighbors);

                    if (counts["water"] > 2 || counts["nature"] > 2) {
                        if (Math.random() < .33) {
                            x.type = "nature";
                        }
                    }
                    else if (Math.random() < .05) {
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
        console.log(i + "," + j);
        console.log(i2 + "," + j2);

        this.centerX = i;
        this.centerY = j;

        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                if (x === j || y === i || x === j2 || y === i2) {
                    let tile: ITile = { type: "road", x, y };

                    var existingtile = this.getTile(x, y, false);
                    if (existingtile) {
                        existingtile.type = "road";
                    }
                    else {
                        this.setTile(x, y, tile);
                    }
                }
            }
        }

        this.getTile(j, i, false)!.type = "busyroad";
        this.getCloseNeighbors(j, i, false).forEach(t => {
            if (t) {
                t.type = "busyroad";
            }
        });
    }

    private getCloseNeighbors = (x: number, y: number, addMissing: boolean): (ITile | undefined)[] => {
        return [
            this.getTile(x - 1, y, addMissing),
            this.getTile(x, y - 1, addMissing),
            this.getTile(x + 1, y, addMissing),
            this.getTile(x, y + 1, addMissing),
        ];
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
                if (t.type != "empty" && t.type != "water" && t.type != "nature") {
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
        for (var tile of this.allTiles) {

            var neighbors = this.getNeighbors(tile.x, tile.y, tile.type != "empty");
            var counts = this.getTypes(neighbors);
            
            var closeneighbors = this.getCloseNeighbors(tile.x, tile.y, tile.type != "empty");
            var closeCounts = this.getTypes(closeneighbors);

            var initialType = tile.type;
            switch (tile.type) {
                case "nature":
                    // slowly clear nature if devloped nearby?
                    if (counts["any"] >= 1) {
                        if (Math.random() < .1) {
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

                    // TODO, this should probably be removed if running during the game
                    // Better to have them actualyl get money and pay rent and stuff maybe
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

                case "busyroad":
                    if (closeCounts["busyroad"] == 0) {
                        tile.type = "road";
                    }

                    if (closeCounts["road"] + closeCounts["busyroad"] == 0) {
                        tile.type = "empty";
                    }

                    if (counts["road"] + counts["busyroad"] == 8) {
                        if (Math.random() < .25) {
                            tile.type = "downtown";
                        }
                    }

                    break;
                case "road":
                    if (closeCounts["road"] + closeCounts["busyroad"] == 0) {
                        tile.type = "empty";
                    }

                    if (counts["road"] + counts["busyroad"] == 8) {
                        if (Math.random() < .1) {
                            tile.type = "downtown";
                        }
                    }
                    if (counts["downtown"] >= 1) {
                        if (Math.random() < .01) {
                            tile.type = "busyroad";
                        }
                    }
                    if (counts["busyroad"] <= 2) {
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

            if (tile.type == initialType) {
                Construction.UpdateTileConstruction(tile);
            }
            else {
                Construction.BuildNewTile(tile);
            }

        }
    }

    private drawAllRoads = () => {
        this.allTiles.forEach(t => {
            if(t.type == "road" || t.type == "busyroad"){
                this.drawTile(t, this.ctx!);
            }
        })
    }

    private drawAllTiles = () => {
        var gridUnits: {[key:string]: IUnit[]} = {};
        this.allUnits.forEach(u => {
            let x = Math.round(u.x);
            let y = Math.round(u.y);
            var i = x + "," + y;

            gridUnits[i] = gridUnits[i] || [];
            gridUnits[i].push(u);
        });

        // order based on the location...
        for (var x = this.minTile; x < this.maxTile; x++) {
            for (var y = this.minTile; y < this.maxTile; y++) {
                let t = this.getTile(x, y, false);
                if (t && t.type != "road" && t.type != "busyroad") {
                    this.drawTile(t, this.ctx!);
                }

                // get units left on this tile
                var units = gridUnits[x + "," + y];
                if(units){
                    // TODO sort better!
                    units.sort((a,b) => {
                        if(a.x < b.x && a.y < b.y){
                            return 1;
                        }
                        if(a.x > b.x || a.y > b.y){
                            return -1;
                        }

                        return 0;
                    }).forEach(u => this.drawUnit(u, this.ctx!));
                }
            }
        }
    }

    private addNewTiles = () => {
        this.allTiles = this.allTiles.concat(this.newTiles);
        this.newTiles = [];
    }

    private runStep = () => {
        this.updateTiles();
        this.addNewTiles();

        this.clearMap();

        if (this.currentSteps < this.generationSteps) {
            this.currentSteps++;
            setTimeout(this.runStep, 50);
        }
        else {
            console.log("done making terrain, starting a DAY!");
            this.startRunningDay();
        }
    }
    private carOffset = .07;
    private moveUnits = () => {
        // but how to handle lane offset?
        this.allUnits.forEach(unit => {
            var stepSize = 1 / this.animationsPerCarTile;
            var goalX = unit.nextTile!.x;
            var goalY = unit.nextTile!.y;

            var xDir = Math.abs(goalX - unit.x) > Math.abs(goalY - unit.y);

            if(unit.direction == "_1_0_0_0"){
                goalY -= this.carOffset;
            }
            if(unit.direction == "_0_1_0_0"){
                goalX += this.carOffset;
            }
            if(unit.direction == "_0_0_1_0"){
                goalY += this.carOffset;
            }
            if(unit.direction == "_0_0_0_1"){
                goalX -= this.carOffset;
            }

            // how to handle, corners and stuff like that?

            if (goalX >= unit.x + stepSize) {
                if (xDir) {unit.direction = "_0_0_1_0";}
                unit.x += stepSize;
            }
            else if (goalX <= unit.x - stepSize) {
                if(xDir){unit.direction = "_1_0_0_0";}
                unit.x -= stepSize;
            }
            else {
                unit.x = goalX;
            }

            if (goalY >= unit.y + stepSize) {
                if(!xDir){unit.direction = "_0_0_0_1";}
                unit.y += stepSize;
            }
            else if (goalY <= unit.y - stepSize) {
                if(!xDir){unit.direction = "_0_1_0_0";}
                unit.y -= stepSize;
            }
            else {
                unit.y = goalY;
            }
        });
    }

    private updateUnits = () => {
        this.allUnits.forEach(unit => {
            // this is wrong for moving.
            // actually use the NEXT tile. since this is where it actually moved TO
            //var unitX = Math.round(unit.x);
            //var unitY = Math.round(unit.y);

            if (unit.nextTile) {
                unit.x = unit.nextTile.x;
                unit.y = unit.nextTile.y;
            }

            var unitX = unit.x;
            var unitY = unit.y;
            
            if(unit.direction == "_1_0_0_0"){
                unit.y -= this.carOffset;
            }
            if(unit.direction == "_0_1_0_0"){
                unit.x += this.carOffset;
            }
            if(unit.direction == "_0_0_1_0"){
                unit.y += this.carOffset;
            }
            if(unit.direction == "_0_0_0_1"){
                unit.x -= this.carOffset;
            }

            //console.log("deciding");
            //console.log("current: " + ((unit.nextTile && unit.nextTile.x) || "X") +"," + ((unit.nextTile && unit.nextTile.y) || "Y"));
            //console.log("last: " + unit.lastTile!.x +"," + unit.lastTile!.y);

            var difX = unitX - unit.lastTile.x;
            var difY = unitY - unit.lastTile.y;

            var straightX = unitX + difX;
            var straightY = unitY + difY;

            var neighbors = this.getCloseNeighbors(unitX, unitY, false);

            // BUY
            var business = neighbors.filter(n => !!n && n.type == "yourbusiness");
            if (business.length > 0) {
                if (Math.random() < 11) {
                    // sell!
                    // TODO: draw a line! 

                    var unitSpot = this.convertToScreenSpace(unit,2,1);
                    var businessSpot = this.convertToScreenSpace(business[0]!, 2, 1);

                    this.ctx!.beginPath();
                    this.ctx!.lineWidth = 2;
                    this.ctx!.strokeStyle = "gold";
                    this.ctx!.moveTo(unitSpot.x, unitSpot.y);
                    this.ctx!.lineTo(businessSpot.x, businessSpot.y);
                    this.ctx!.stroke();
                    this.ctx!.closePath();

                    this.money += 10;
                    console.log("SOLD! $" + this.money);
                }
            }

            // MOVE
            var straightRoad = neighbors.filter(n =>
                n
                && (n.type == "road" || n.type == "busyroad")
                && n.x == straightX
                && n.y == straightY);

            var nextRoad = unit.lastTile;
            if (straightRoad[0] && Math.random() < .75) {
                nextRoad = straightRoad[0]!;
            }
            else {
                var roads = neighbors.filter(n => (n && n != unit.lastTile && (n.type == "road" || n.type == "busyroad")));
                if (roads.length > 0) {
                    var i = Math.round(Math.random() * (roads.length - 1));
                    nextRoad = roads[i]!;
                }
            }

            // find a neighboring road, try to avoid the previous tile if possible, but if no others use it

            // better to.. go straight...
            unit.nextTile = nextRoad;
            //unit.x = unit.nextTile!.x;
            //unit.y = unit.nextTile!.y;

            unit.lastTile = this.getTile(unitX, unitY, false)!;
            if(!unit.lastTile){
                console.log("no last tile!! at " + unitX)
            }

        });
    }

    private startRunningDay = () => {
        var onlyOneCar = false;
        var onlyOneBusiness = false;
        this.allTiles.forEach(t => {
            // build all existing roads
            if(t.type == "road" || t.type == "busyroad"){
                t.construction = undefined;
            }

            // just spawn one car for now
            if (!onlyOneCar && t.type == "house") {
                var neighbors = this.getCloseNeighbors(t.x, t.y, false);
                var counts = this.getTypes(neighbors);
                if (counts["road"] + counts["busyroad"] > 0) {
                    //x = true;
                    // spawn a car
                    this.allUnits.push({ type: "car", x: t.x, y: t.y, lastTile: t });
                }
            }
        });

        this.allTiles.forEach(t => {
            // just spawn one for now
            if (!onlyOneBusiness && t.type == "shoppingcenter" && Math.random() < .1) {
                var neighbors = this.getCloseNeighbors(t.x, t.y, false);
                var counts = this.getTypes(neighbors);
                if (counts["road"] + counts["busyroad"] > 0) {
                    onlyOneBusiness = true;
                    t.type = "yourbusiness";
                    t.construction = undefined;

                    var s = this.convertToScreenSpace(t);

                    this.centerX = t.x;
                    this.centerY = t.y;
                    this.scale = 14;
                }
            }
        });

        this.runDay();
    }

    private drawUnit = (unit: IUnit, ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = "magenta";
        var converted = this.convertToScreenSpace(unit);
        let image = this.imageManager.GetImage("car" + unit.direction) || this.imageManager.GetImage("car");
        ctx.drawImage(image, converted.x, converted.y, converted.tileSize, converted.tileSize);
    }

    private stepsPerDay = 25;
    private currentDayStep = 0;

    private animationsPerCarTile = 10;
    private currentAnimationStep = 0;

    private convertToOrtho = (tile: entity) => {
        var x = .81 * (.505 * tile.x - .505 * tile.y);
        var y = .81 * (.305 * tile.y + .305 * tile.x);
        return { x, y };
    }


    private convertFromOrtho = (tile: entity) => {
        var x = .81 * ((1 / .505) * tile.x + (1 / .505) * tile.y);
        var y = .81 * ((1 / .305) * tile.y - (1 / .305) * tile.x);
        return { x, y };
    }

    private convertToScreenSpace = (tile: entity, offsetX: number = 0, offsetY: number = 0) => {
        var vTileSize = this.tileSize * this.scale;
        //var vTileX = ((tile.x + offsetX - this.centerX)) * vTileSize + (this.canvasSize / 2);
        //var vTileY = ((tile.y + offsetY - this.centerY)) * vTileSize + (this.canvasSize / 2);

        var t = { x: tile.x + offsetX, y: tile.y + offsetY };
        var ortho = this.convertToOrtho(t)
        var center = this.convertToOrtho({ x: this.centerX, y: this.centerY });

        var vTileSize = this.tileSize * this.scale;
        var vTileX = ((ortho.x - center.x)) * vTileSize + (this.canvasSize / 2);
        var vTileY = ((ortho.y - center.y)) * vTileSize + (this.canvasSize / 2);

        return { x: vTileX, y: vTileY, tileSize: vTileSize };
    }

    private runDay = () => {
        if(this.currentDayStep == 0){
            this.updateTiles();
            this.addNewTiles();
        }
        
        this.clearMap();

        if (this.currentAnimationStep == 0) {
            this.updateUnits();
        }
        else {
            this.moveUnits();
        }

        this.currentAnimationStep++;
        if (this.currentAnimationStep > this.animationsPerCarTile) { this.currentAnimationStep = 0; this.currentDayStep++; }
        if (this.currentDayStep > this.stepsPerDay) { this.currentDayStep = 0; }

        setTimeout(this.runDay, 10);
    }

    private clearMap = () => {
        this.ctx!.fillStyle = "green";
        this.ctx!.fillRect(0, 0, this.canvasSize, this.canvasSize);
        this.drawAllRoads();
        this.drawAllTiles();
    }

    private onKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
        switch(ev.key){
            case "z":
                this.scale *= 1.5;
            break;
            case "x":
                this.scale /= 1.5;
            break;
            case "ArrowRight":
                this.centerX++;
            break;
            case "ArrowLeft":
                this.centerX--;
            break;
            case "ArrowUp":
                this.centerY--;
            break;
            case "ArrowDown":
                this.centerY++;
            break;
            default:
            console.log("No case registered for " + ev.key);
            break;
        }
    }

    private dragging = false;
    private startX = 0;
    private startY = 0;

    render() {
        return <div tabIndex={0} onKeyDown={this.onKeyDown}>
            <div>
                <button onClick={() => { this.runDay() }}>STEP</button>
                <button onClick={() => { this.scale *= 1.1; this.clearMap(); }}>+</button>
                <button onClick={() => { this.scale *= .9; this.clearMap(); }}>-</button>
            </div>
            <canvas
                onMouseDown={ev => { this.dragging = true; this.startX = ev.screenX; this.startY = ev.screenY; }}
                onMouseUp={ev => { this.dragging = false; }}
                onMouseMove={ev => {
                    if (this.dragging) {
                        var movement = {
                            x: (this.startX - ev.screenX) / (this.scale * this.tileSize),
                            y: (this.startY - ev.screenY) / (this.scale * this.tileSize)
                        };

                        var scaled = this.convertFromOrtho(movement);

                        this.centerX += scaled.x;
                        this.centerY += scaled.y;
                        this.startX = ev.screenX; this.startY = ev.screenY;
                        this.clearMap();
                    }
                }}
                width={this.canvasSize.toString()}
                height={this.canvasSize.toString()}
                style={{ height: this.canvasSize + "px", width: this.canvasSize + "px" }}
                ref={c => {
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
                <br/>
                This game is open source. <a href="https://github.com/Macflash/capitilism-the-game">Learn more</a>
        </div>;
    }
}