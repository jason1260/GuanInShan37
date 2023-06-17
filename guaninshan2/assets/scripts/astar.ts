// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import Player from "./player";
import { pathing_Map } from "./GM";
import gameInfo = require("./gameInfo");
interface GridNode {
    x: number;
    y: number;
    walkable: boolean;
    f?: number;
    g?: number;
    h?: number;
    parent?: GridNode;
}

@ccclass
export default class Astar extends cc.Component {
    target: cc.Node = null;
    selfNode: cc.Node = null;

    private grid: GridNode[][];
    private flag: boolean;
    private counter: number;
    private nextstep: cc.Vec2 = null;
    public handState: string = "";
    stx: number = 0;
    sty: number = 0;
    edx: number = 0;
    edy: number = 0;
    startplace: cc.Vec2 = null;
    thershold: number = 0;
    counter2: number = 0;
    step: number = 0;
    walkPath: boolean;
    speed: number = 200;
    samplediameter: number = 288;

    onLoad(): void {
        this.flag = false;
        this.counter = 301;
        this.counter2 = 0;
        this.step = 0;
        this.nextstep = cc.v2(0, 0);
        this.walkPath = false;
        this.speed = 250;
    }
    update() {
        if (!this.flag) { this.createGrid(); this.flag = true };
        if (this.counter <= 30) this.counter += 1;
        else {
            this.startplace = this.selfNode.convertToWorldSpaceAR(new cc.Vec2(0, 0));
            const endplace = this.target.convertToWorldSpaceAR(new cc.Vec2(0, 0));
            /* console.log(endplace.x / 48, endplace.y / 48); */
            this.stx = Math.floor(this.startplace.x / 48);
            this.sty = Math.floor(this.startplace.y / 48);
            // smaple end point
            if (!gameInfo.rangedWeapon.includes(this.handState)) this.samplediameter = 144;
            const random1 = Math.random();
            this.edx = endplace.x - (this.samplediameter / 2) + (random1 * this.samplediameter);
            const random2 = Math.random();
            this.edy = endplace.y - (this.samplediameter / 2) + (random2 * this.samplediameter);
            this.edx = Math.floor(this.edx / 48);
            this.edy = Math.floor(this.edy / 48);
            if (this.edx < 0) this.edx = 0;
            else if (this.edx > 39) this.edx = 39;
            if (this.edy < 0) this.edy = 0;
            else if (this.edy > 24) this.edy = 24;
            //
            this.counter = 0;
            this.counter2 = 0;
            this.step = 0;
            const startNode = this.grid[this.sty][this.stx];
            const endNode = this.grid[this.edy][this.edx];
            const dis = Math.abs(this.stx - this.edx) + Math.abs(this.sty - this.edy);
            // move slower when too close to others
            if (dis < 2) this.speed *= 0.6;
            // make sure it keeps social distancing
            if (dis < 1) this.selfNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            else {
                const path = this.calculateNextStep(startNode, endNode);

                /*  console.log(path); */
                if (!path) console.log("error");
                else if (path.length < 2) this.selfNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                else {
                    const xv = path[0].x - this.stx;
                    const yv = path[0].y - this.sty;
                    let lv = cc.v2(0, 0);
                    // const lv = cc.v2((path[0].x - this.stx) * 250, (path[0].y - this.sty) * 250);
                    if (xv && yv) {
                        lv = cc.v2((xv) * this.speed * 0.7, yv * this.speed * 0.7);
                        /* console.log("speed", this.speed, xv, yv, lv); */
                    }
                    else lv = cc.v2(xv * this.speed, yv * this.speed);
                    /* console.log("velocity", xv, yv, this.speed); */
                    this.selfNode.getComponent(cc.RigidBody).linearVelocity = lv;
                }
            }
            this.counter = 0;
        }

        // }
    }

    setHandState(hand: string) {
        this.handState = hand;
    }
    setTarget(Target: cc.Node) {
        this.target = Target;
    }
    setSelf(Self: cc.Node) {
        this.selfNode = Self;
    }


    calculateNextStep(start: GridNode, end: GridNode): GridNode[] {
        const openList: GridNode[] = [start];
        const closedList: GridNode[] = [];
        let count = 0;


        while (openList.length > 0) {
            count++;
            // Find the node with the lowest cost
            let currentIndex = 0;
            for (let i = 1; i < openList.length; i++) {
                if (openList[i].f < openList[currentIndex].f) {
                    currentIndex = i;
                }
            }

            const currentNode = openList[currentIndex];

            // Move the current node from the open list to the closed list
            openList.splice(currentIndex, 1);
            closedList.push(currentNode);

            // Check if the current node is the destination
            if (currentNode.x == end.x && currentNode.y == end.y) {
                /* console.log("hello"); */
                const path: GridNode[] = [];
                let current = currentNode;

                while (current) {
                    path.push(current);
                    current = current.parent;
                    if (current && current.x == start.x && current.y == start.y) {
                        /* console.log("hello"); */
                        break;
                    }
                }

                if (!path) return null;

                return path.reverse();
            }

            const neighbors = this.getNeighbors(currentNode);

            for (const neighbor of neighbors) {
                if (closedList.includes(neighbor) || !neighbor.walkable) {
                    continue;
                }

                const gScore = currentNode.g + 1; // Assuming a uniform cost of movement
                const hScore = this.calculateHeuristic(neighbor, end);
                const fScore = gScore + hScore;

                if (!openList.includes(neighbor) || fScore < neighbor.f) {
                    neighbor.g = gScore;
                    neighbor.h = hScore;
                    neighbor.f = fScore;
                    neighbor.parent = currentNode;
                    // if (neighbor.x == end.x && neighbor.y == end.y)
                    // console.log("test for the end", currentNode);

                    if (!openList.includes(neighbor)) {
                        openList.push(neighbor);
                    }
                }
            }
        }

        // Path not found
        return null;
    }

    reconstructPath(node: GridNode): GridNode[] {
        const path: GridNode[] = [node];
        let current = node;

        while (current.parent) {
            path.push(current.parent);
            current = current.parent;
        }

        return path.reverse();
    }

    getNeighbors(node: GridNode): GridNode[] {
        const neighbors: GridNode[] = [];
        const { x, y } = node;
        const numRows = this.grid[0].length;
        const numCols = this.grid.length;
        // console.log("grid size", numRows, numCols);

        // Check neighboring nodes

        // Cardinal directions
        if (x > 0) neighbors.push(this.grid[y][x - 1]); // Left
        if (x < numRows - 1) neighbors.push(this.grid[y][x + 1]); // Right
        if (y > 0) neighbors.push(this.grid[y - 1][x]); // Up
        if (y < numCols - 1) neighbors.push(this.grid[y + 1][x]); // Down

        // Diagonal directions
        if (x > 0 && y > 0) neighbors.push(this.grid[y - 1][x - 1]); // Up-Left
        if (x > 0 && y < numCols - 1) neighbors.push(this.grid[y + 1][x - 1]); // Down-Left
        if (x < numRows - 1 && y > 0) neighbors.push(this.grid[y - 1][x + 1]); // Up-Right
        if (x < numRows - 1 && y < numCols - 1) neighbors.push(this.grid[y + 1][x + 1]); // Down-Right

        return neighbors;
    }

    createGrid() {
        const numRows = pathing_Map[0].length;
        const numCols = pathing_Map.length;
        /* console.log(pathing_Map); */

        this.grid = [];

        for (let row = 0; row < numRows; row++) {
            const gridRow: GridNode[] = [];

            for (let col = 0; col < numCols; col++) {
                const walkable = pathing_Map[col][24 - row] === 0 || pathing_Map[col][24 - row] === 2 || pathing_Map[col][24 - row] === 4;

                const gridNode: GridNode = {
                    x: col,
                    y: row,
                    walkable: walkable,
                    g: 0,
                };

                gridRow.push(gridNode);
            }

            this.grid.push(gridRow);
        }

        /* console.log("this.grid", this.grid); */
    }

    calculateHeuristic(nodeA: GridNode, nodeB: GridNode): number {
        // Using Manhattan distance heuristic
        const dx = Math.abs(nodeA.x - nodeB.x);
        const dy = Math.abs(nodeA.y - nodeB.y);
        const heuristic = dx + dy;

        // Consider walls as additional cost
        const wallsCount = this.countWallsBetween(nodeA, nodeB);
        const wallCost = 1; // Adjust this value based on your game's requirements
        const totalHeuristic = heuristic + wallsCount * wallCost;

        return totalHeuristic;
    }

    countWallsBetween(nodeA: GridNode, nodeB: GridNode): number {
        const startX = Math.min(nodeA.x, nodeB.x);
        const startY = Math.min(nodeA.y, nodeB.y);
        const endX = Math.max(nodeA.x, nodeB.x);
        const endY = Math.max(nodeA.y, nodeB.y);

        let wallsCount = 0;

        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                if (!this.grid[y][x].walkable) {
                    wallsCount++;
                }
            }
        }

        return wallsCount;
    }
}