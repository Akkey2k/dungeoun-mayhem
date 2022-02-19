class Player {
    constructor(ctx) {
        this.ctx = ctx;

        this.player = new Image();
        this.imgFolder = "../img/Player/spritesheet.png";
        this.player.src = this.imgFolder;

        this.arrow = new Image();
        this.arrow.src = "../img/Player/arrow.png"
        this.angle = 0;
        this.arrowOffset = 45;

        this.health = 5;
        this.healthMax = 5;

        this.xPos = (innerWidth - 100) / 2;
        this.yPos = (innerHeight - 100) / 2;

        this.frameWidth = 50;
        this.frameHeight = 37;

        this.up = false;
        this.right = false;
        this.down = false;
        this.left = false;

        this.animationType = "idle";
        this.animationDirection = "idle";
        this.sustainedAnimationEnabled = false;

        this.step = 15;

        this.sprites = {
            idle: {
                idle: {
                    spriteYpos: 0,
                    frameCount: 4,
                },
                up: {
                    spriteYpos: 0,
                    frameCount: 4,
                },
                right: {
                    spriteYpos: 0,
                    frameCount: 4,
                },
                down: {
                    spriteYpos: 0,
                    frameCount: 4,
                },
                left: {
                    spriteYpos: 0,
                    frameCount: 4,
                },
            },
            run: {
                up: {
                    spriteYpos: 1,
                    frameCount: 6,
                },
                right: {
                    spriteYpos: 1,
                    frameCount: 6,
                },
                down: {
                    spriteYpos: 1,
                    frameCount: 6,
                },
                left: {
                    spriteYpos: 2,
                    frameCount: 6,
                },
            },
            attack: {
                idle: {
                    spriteYpos: 3,
                    frameCount: 5,
                },
                up: {
                    spriteYpos: 3,
                    frameCount: 5,
                },
                right: {
                    spriteYpos: 3,
                    frameCount: 5,
                },
                down: {
                    spriteYpos: 3,
                    frameCount: 5,
                },
                left: {
                    spriteYpos: 4,
                    frameCount: 5,
                }
            },
            hurt: {
                idle: {
                    spriteYpos: 5,
                    frameCount: 3,
                },
                up: {
                    spriteYpos: 5,
                    frameCount: 3,
                },
                right: {
                    spriteYpos: 5,
                    frameCount: 3,
                },
                down: {
                    spriteYpos: 5,
                    frameCount: 3,
                },
                left: {
                    spriteYpos: 6,
                    frameCount: 3,
                }
            },
            die: {
                idle: {
                    spriteYpos: 7,
                    frameCount: 7,
                },
                up: {
                    spriteYpos: 7,
                    frameCount: 7,
                },
                right: {
                    spriteYpos: 7,
                    frameCount: 7,
                },
                down: {
                    spriteYpos: 7,
                    frameCount: 7,
                },
                left: {
                    spriteYpos: 8,
                    frameCount: 7,
                }
            },
        }
    }

    /* CORE */

    init() {
        this.setAnimationType("idle", "idle");
    }

    update() {
        this.changePosition();
        this.changeFrame();
    }

    setAnimationType(type, direction, isSustained) {
        direction = direction || this.animationDirection;

        this.animationType = type;
        this.animationDirection = direction;

        if (isSustained) this.sustainedAnimationEnabled = true;
    }

    draw() {
        let frameXoffset = this.frameWidth * this.animationCount;
        let frameYoffset = this.frameHeight * this.animationYpos;

        this.ctx.drawImage(this.player, frameXoffset, frameYoffset, this.frameWidth, this.frameHeight, this.xPos, this.yPos, this.frameWidth * 2, this.frameHeight * 2);
        
        this._drawArrow()
    }

    _drawArrow(){
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // sets scales and origin
        this.ctx.save();

        this.ctx.setTransform(1, 0, 0, 1, this.xPos, this.yPos); // sets scales and origin
        this.ctx.translate(this.arrowOffset, this.arrowOffset);
        this.ctx.rotate(this._getArrowAngle() * Math.PI / 180);
        this.ctx.drawImage(this.arrow, 0, 0, 64, 64, 0, -60, 16, 16);

        this.ctx.restore();        
    }

    _getArrowAngle(){
        if(!window.mousePosX || !window.mousePosY){
            return 0;
        }

        const getVector = function (p1, p2) {
            return {
                x: p2.x - p1.x,
                y: p2.y - p1.y
            };
        };

        const dotProduct = function(v1, v2) {
            return v1.x * v2.x + v1.y * v2.y;
        };
        
        const crossProduct = function(v1, v2) {
            return v1.x * v2.y - v1.y * v2.x;
        };

        const getAngle = function (v1, v2) {
            var dot = dotProduct(v1, v2);
            var cross = crossProduct(v1, v2);
          
            return Math.atan2(cross, dot);
        };

        const a = {x: this.xPos, y: window.innerHeight - this.yPos};
        const b = {x: this.xPos, y: window.innerHeight };

        const c = {x: this.xPos + this.arrowOffset, y: window.innerHeight - this.yPos};
        const d = {x: window.mousePosX, y: window.innerHeight - window.mousePosY + this.arrowOffset};

        const v1 = getVector(a, b);
        const v2 = getVector(c, d);
        const alpha = getAngle(v1, v2);

        this.angle = -(alpha * 180) / Math.PI;

        return this.angle;
    }

    initMoveHandler() {
        document.addEventListener('keydown', (e) => this.press(e))
        document.addEventListener('keyup', (e) => this.release(e))
    }

    changeFrame() {
        if(this.currentAnimation == this.animationType + this.animationDirection){
            if(this.sustainedAnimationEnabled) {
                if((this.sprites[this.animationType][this.animationDirection].frameCount - 1) == this.animationCount) {
                    this.sustainedAnimationEnabled = false;
                    this.animationCount = 0;
                    this.setAnimationType("idle");
                }
                else{
                    this.animationCount += 1;
                }
            }
            else{
                this.animationCount = (this.sprites[this.animationType][this.animationDirection].frameCount - 1) == this.animationCount ? 0 : this.animationCount += 1;
            }
        }
        else{
            this.currentAnimation = this.animationType + this.animationDirection;
            this.animationCount = 0;
        }

        this.animationYpos = this.sprites[this.animationType][this.animationDirection].spriteYpos;
        
        this.draw();
    }

    changePosition() {
        if(!this.sustainedAnimationEnabled){
            if (this.up) {
                this.yPos = this.yPos - this.step;

                if(this.animationDirection != "up" || this.animationType != "run"){
                    this.setAnimationType("run", "up");
                }
            }
            if (this.right) {
                this.xPos = this.xPos + this.step

                if(this.animationDirection != "right" || this.animationType != "run"){
                    this.setAnimationType("run", "right");
                }
            }
            if (this.down) {
                this.yPos = this.yPos + this.step

                if(this.animationDirection != "down" || this.animationType != "run"){
                    this.setAnimationType("run", "down");
                }
            }
            if (this.left) {
                this.xPos = this.xPos - this.step

                if(this.animationDirection != "left" || this.animationType != "run"){
                    this.setAnimationType("run", "left");
                }
            }
        }

        if(!this.up && !this.right && !this.down && !this.left) {
            if(!this.sustainedAnimationEnabled){
                this.setAnimationType("idle");
            }
        }
    }

    press(e) {
        if(this.sustainedAnimationEnabled){
            return;
        }


        if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */) {
            this.up = true;
            this.setAnimationType("run", "up");
        }
        if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */ ) {
            this.right = true;
            this.setAnimationType("run", "right");
        }
        if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */ ) {
            this.down = true
            this.setAnimationType("run", "down");
        }
        if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */) {
            this.left = true
            this.setAnimationType("run", "left");
        }


        if (e.keyCode === 13 /* enter */) {
            this.setAnimationType("attack", null, true);
        }
    }

    release(e) {
        if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */) {
            this.up = false;
        }
        if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */ ) {
            this.right = false;
        }
        if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */ ) {
            this.down = false;
        }
        if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ ) {
            this.left = false;
        }
    }


    /* Health Points */

    getHP(){
        return this.health;
    }

    getHPMax(){
        return this.healthMax;
    }

    dealDamage() {
        this.health = ( this.health - 1 ) <= 0 ? 0 : this.health - 1;

        if(this.health){
            this.setAnimationType("hurt", null, true);
        }
        else{
            this.setAnimationType("die", null, true);
        }
    }

    heal(hp){
        if((this.health + hp) < this.healthMax){
            this.health += hp;
        }
        else{
            this.health = this.healthMax;
        }
    }
}

export { Player };