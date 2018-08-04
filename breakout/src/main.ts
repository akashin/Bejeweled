const SCREEN_H = 640;
const SCREEN_W = 480;

const UNIT_LENGTH = 20;

const BLOCK_H = 1 * UNIT_LENGTH;
const BLOCK_W = 2 * UNIT_LENGTH;

const PAD_STEP = 0.8 * UNIT_LENGTH;
const PAD_H = 0.5 * UNIT_LENGTH;
const PAD_W = 3 * UNIT_LENGTH;

const BALL_RADIUS = 0.5 * UNIT_LENGTH;

const BLOCK_COLOR = "red"
const PAD_COLOR = "blue"
const BALL_COLOR = "black"

// Keycodes.
const KEYCODE_P = 80;
const KEYCODE_LEFT = 37;
const KEYCODE_RIGHT = 39;
const KEYCODE_UP = 38;
const KEYCODE_DOWN = 40;

class Block extends createjs.Shape {
    is_active: boolean;

    constructor() {
        super()

        this.is_active = true;

        this.graphics
            .setStrokeStyle(1)
            .beginStroke("#000000")

        this.graphics.beginFill(BLOCK_COLOR);
        this.graphics.drawRect(0, 0, BLOCK_W, BLOCK_H);

        this.regX = BLOCK_W / 2
        this.regY = BLOCK_H
    }

    // TODO: Replace this with this.hitTest.
    hasInside(x: number, y: number) {
        let left_x = this.x - BLOCK_W / 2
        let right_x = this.x + BLOCK_W / 2
        let upper_y = this.y - BLOCK_H
        let lower_y = this.y

        return (x > left_x && x < right_x) && (y > upper_y && y < lower_y);
    }

    checkCollision(ball: Ball) {
        if (!this.is_active) {
            return;
        }

        var was_hit = false;

        // From left or from right.
        if (this.hasInside(ball.x - BALL_RADIUS, ball.y) ||
            this.hasInside(ball.x + BALL_RADIUS, ball.y)) {
            ball.x_velocity *= -1;
            was_hit = true;
        }
        // From up or from below.
        if (this.hasInside(ball.x, ball.y - BALL_RADIUS) ||
            this.hasInside(ball.x, ball.y + BALL_RADIUS)) {
            ball.y_velocity *= -1;
            was_hit = true;
        }

        if (was_hit) {
            this.destroy()
        }
    }

    destroy() {
        this.is_active = false;
        this.graphics.clear()
    }
};

class Pad extends createjs.Shape {
    constructor() {
        super()

        this.graphics
            .setStrokeStyle(1)
            .beginStroke("#000000")
        this.graphics.beginFill(PAD_COLOR);
        // TODO: Make pad with rounded corners.
        this.graphics.drawRect(0, 0, PAD_W, PAD_H);

        // Set center of the pad.
        this.regX = PAD_W / 2;
        this.regY = PAD_H;
    }

    // TODO: Replace this with this.hitTest.
    hasInside(x: number, y: number) {
        // Can we use bounding box here?
        let left_x = this.x - PAD_W / 2
        let right_x = this.x + PAD_W / 2
        let upper_y = this.y - PAD_H
        let lower_y = this.y

        return (x > left_x && x < right_x) && (y > upper_y && y < lower_y);
    }

    checkCollision(ball: Ball) {
        // From left or from right.
        if (this.hasInside(ball.x - BALL_RADIUS, ball.y) ||
            this.hasInside(ball.x + BALL_RADIUS, ball.y)) {
            ball.x_velocity *= -1;
        }
        // From up or from below.
        if (this.hasInside(ball.x, ball.y - BALL_RADIUS) ||
            this.hasInside(ball.x, ball.y + BALL_RADIUS)) {
            ball.y_velocity *= -1;
        }
    }
};

class Ball extends createjs.Shape {
    x_velocity : number;
    y_velocity : number;

    constructor() {
        super()

        this.x_velocity = 0.2 * UNIT_LENGTH;
        this.y_velocity = -0.2 * UNIT_LENGTH;

        this.graphics
            .setStrokeStyle(1)
            .beginStroke("#000000")
        this.graphics.beginFill(BALL_COLOR);
        this.graphics.drawCircle(0, 0, BALL_RADIUS);

        // Set center of the ball.
        //this.shape.regX = BALL_RADIUS;
        //this.shape.regY = BALL_RADIUS;
    }
}

class ScreenBorder extends createjs.Shape {
    constructor() {
        super()

        this.graphics
            .setStrokeStyle(1)
            .beginStroke("#000000")
        this.graphics.drawRect(0, 0, SCREEN_W, SCREEN_H);
    }

    checkCollision(ball: Ball) {
        if (ball.x < BALL_RADIUS || ball.x > SCREEN_W - BALL_RADIUS) {
            ball.x_velocity *= -1;
        }
        if (ball.y < BALL_RADIUS || ball.y > SCREEN_H - BALL_RADIUS) {
            ball.y_velocity *= -1;
        }
    }
}

class GameScreen extends createjs.Container {
    game_paused: boolean;
    screen_border: ScreenBorder;
    pad: Pad;
    ball: Ball;
    blocks: Array<Block>;

    constructor() {
        super()

        this.game_paused = false;

        this.screen_border = new ScreenBorder();
        this.addChild(this.screen_border);

        this.pad = new Pad();
        this.addChild(this.pad);

        this.ball = new Ball();
        this.addChild(this.ball);

        this.pad.x = SCREEN_W / 2;
        this.pad.y = SCREEN_H;

        this.ball.x = SCREEN_W / 2;
        this.ball.y = 0.75 * SCREEN_H;

        this.blocks = new Array<Block>();
    }

    tick() {
        if (this.game_paused) {
            return;
        }

        this.ball.x += this.ball.x_velocity;
        this.ball.y += this.ball.y_velocity;

        let entities = [this.screen_border]
        for (let block of this.blocks) {
            entities.push(block);
        }

        for (let entity of entities) {
            entity.checkCollision(this.ball)
        }
    }

    populateBlocks() {
        let H_BLOCK_COUNT = 5;
        let W_BLOCK_COUNT = 7;
        for (let i = 0; i < H_BLOCK_COUNT; ++i) {
            for (let j = 0; j < W_BLOCK_COUNT; ++j) {
                let block = new Block();
                block.x = SCREEN_W / 2 + ((j - ((W_BLOCK_COUNT - 1) / 2)) * BLOCK_W);
                block.y = SCREEN_H / 4 + ((i - ((H_BLOCK_COUNT - 1) / 2)) * BLOCK_H);
                this.blocks.push(block);
                this.addChild(block);
            }
        }
    }

    keyPressed(event) {
        switch(event.keyCode) {
            case KEYCODE_LEFT:
                this.pad.x -= PAD_STEP
            break;
            case KEYCODE_RIGHT: 
                this.pad.x += PAD_STEP
            break;
            case KEYCODE_P: 
                this.game_paused = !this.game_paused
            break;
        }
    }
}

class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
};

function main() {
    let stage = new createjs.Stage('BreakoutStage');
    //stage.mouseEnabled = true;

    let game_screen = new GameScreen();
    game_screen.populateBlocks();

    stage.addChild(game_screen);
    stage.update();

    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", stage);
    createjs.Ticker.addEventListener("tick", function() { game_screen.tick() });

    this.document.onkeydown = function(event) {
        game_screen.keyPressed(event);
    };
}
