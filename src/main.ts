var GRID_W = 8;
var GRID_H = 8;

var JEWEL_W = 10;
var JEWEL_H = 10;

// Jewel = {
//     type: 1,
// };

// function createField(W, H) {
//     var Jewel[10][10];
// }

function main() {
    // document.body.innerHTML = "Hello, world!";

    var canvas; //Will be linked to the canvas in our index.html page
    var stage; //Is the equivalent of stage in AS3; we'll add "children" to it

    // Graphics
    //[Background]

    var bg; //The background graphic

    //[Title View]

    var main_background; //The Main Background

    stage = new createjs.StageGL('BejeweledStage');
    stage.mouseEventsEnabled = true;


    var g = new createjs.Graphics();
    g.setStrokeStyle(1);
    g.beginStroke("#000000");
    g.beginFill("red");
    g.drawCircle(100, 100, 30);

    var shape = new createjs.Shape(g);
    stage.addChild(shape);

    shape.cache(0, 0, 600, 400);

    stage.update();
    // createjs.Ticker.addListener(stage);

    createjs.Tween.get(shape, { loop: true })
        .to({ x: 400 }, 1000, createjs.Ease.getPowInOut(4))
        .to({ alpha: 0, y: 175 }, 500, createjs.Ease.getPowInOut(2))
        .to({ alpha: 0, y: 225 }, 100)
        .to({ alpha: 1, y: 200 }, 500, createjs.Ease.getPowInOut(2))
        .to({ x: 100 }, 800, createjs.Ease.getPowInOut(2));

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);
}
