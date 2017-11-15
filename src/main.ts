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
            field[i][j].shape.x = i * JEWEL_W;
            field[i][j].shape.y = j * JEWEL_H;
        }
    }
    return field;
}

function main() {
    let stage = new createjs.StageGL('BejeweledStage');
    stage.mouseEnabled = true;

    let grid_container = new createjs.Container();

    let grid = createGrid(GRID_H, GRID_W);
    for (let i = 0; i < grid.length; ++i) {
        for (let j = 0; j < grid[i].length; ++j) {
            grid_container.addChild(grid[i][j].shape);
        }
    }

    grid_container.cache(0, 0, 640, 480);
    stage.addChild(grid_container);
    stage.update();

    // createjs.Tween.get(shape, { loop: true })
    //     .to({ x: 400 }, 1000, createjs.Ease.getPowInOut(4))
    //     .to({ alpha: 0, y: 175 }, 500, createjs.Ease.getPowInOut(2))
    //     .to({ alpha: 0, y: 225 }, 100)
    //     .to({ alpha: 1, y: 200 }, 500, createjs.Ease.getPowInOut(2))
    //     .to({ x: 100 }, 800, createjs.Ease.getPowInOut(2));

    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", stage);
}
