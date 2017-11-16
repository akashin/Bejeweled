const GRID_W = 8;
const GRID_H = 8;

const JEWEL_W = 40;
const JEWEL_H = 40;

class Jewel {
    type: number;
    shape: createjs.Shape;

    constructor(type: number) {
        this.type = type;
        this.shape = getShapeForType(type);
    }
};

type Row = Array<Jewel>;
type Grid = Array<Row>;

function getCellPosition(x: number, y: number) {
    return new Point(x * JEWEL_W, y * JEWEL_H);
}

function getShapeForType(type: number) {
    let shape = new createjs.Shape();
    shape.graphics
        .setStrokeStyle(1)
        .beginStroke("#000000")

    if (type === 0) {
        shape.graphics.beginFill("red");
        shape.graphics.drawCircle(0, 0, JEWEL_H / 2);
        shape.regX = -JEWEL_H / 2;
        shape.regY = -JEWEL_W / 2;
    } else if (type === 1) {
        shape.graphics.beginFill("yellow");
        shape.graphics.drawRect(0, 0, JEWEL_H, JEWEL_W);
    } else if (type === 2) {
        shape.graphics.beginFill("green");
        shape.graphics.drawPolyStar(0, 0, JEWEL_H / 2, 5, 0, -90);
        shape.regX = -JEWEL_H / 2;
        shape.regY = -JEWEL_W / 2;
    }
    return shape
}

function createGrid(W: number, H: number): Grid {
    let field = new Array<Row>(H);
    for (let i = 0; i < H; ++i) {
        field[i] = Array<Jewel>(W);
        for (let j = 0; j < W; ++j) {
            field[i][j] = new Jewel(randomInt(0, 2));
            let position = getCellPosition(i, j)
            field[i][j].shape.x = position.x;
            field[i][j].shape.y = position.y;
        }
    }
    return field;
}

class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
};

function swapJewels(grid: Grid, p1: Point, p2: Point) {
    let pos1 = getCellPosition(p1.x, p1.y)
    let pos2 = getCellPosition(p2.x, p2.y)
    console.log(pos1);
    console.log(pos2);
    createjs.Tween.get(grid[p1.x][p1.y].shape).to({ x: pos2.x, y: pos2.y }, 1000);
    createjs.Tween.get(grid[p2.x][p2.y].shape).to({ x: pos1.x, y: pos1.y }, 1000);
}

function main() {
    let stage = new createjs.Stage('BejeweledStage');
    stage.mouseEnabled = true;

    let grid_container = new createjs.Container();

    let current_selection: Point = null;

    let grid = createGrid(GRID_H, GRID_W);
    for (let i = 0; i < grid.length; ++i) {
        for (let j = 0; j < grid[i].length; ++j) {
            grid_container.addChild(grid[i][j].shape);
            grid[i][j].shape.on("click", (event) => {
                if (current_selection !== null) {
                    swapJewels(grid, current_selection, new Point(i, j));
                    // Check for three-in-a-row.
                    current_selection = null;
                } else {
                    current_selection = new Point(i, j);
                    console.log("Selected: ", current_selection);
                }
            });
        }
    }

    // grid_container.cache(0, 0, 640, 480);
    stage.addChild(grid_container);
    stage.update();

    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", stage);
}
