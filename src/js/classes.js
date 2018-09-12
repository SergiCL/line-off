kontra.init();

function Player(map, x, y){
    var playerImg = new Image();
    playerImg.src = './assets/imgs/player.png';

    this.sprite = kontra.sprite({
        x: x,
        y: y,
        velocity: 1,
        actualDirection: 0,
        nextDirection:   0,
        image:   playerImg,

        update: function() {
            //Key capture
            if (kontra.keys.pressed('left')) {
                this.nextDirection = directions.LEFT;
            }

            else if (kontra.keys.pressed('right')) {
                this.nextDirection = directions.RIGHT;
            }

            else if (kontra.keys.pressed('up')){
                this.nextDirection = directions.UP;
            }

            else if (kontra.keys.pressed('down')){
                this.nextDirection = directions.DOWN;
            }

            var nextTile = map.getNextTile(this.x, this.y, this.nextDirection);
            if(!map.isTileInsideMap(nextTile)) {
                if((this.nextDirection === this.actualDirection) && isCentered(this.x, this.y)
                    || (this.x === 0 && this.y === 0 && isCentered(this.x, this.y)) || (this.x === 315 && this.y === 0)
                    || (this.x === 315 && this.y === 165) || (this.x === 0 && this.y === 165))
                {
                    this.actualDirection = 0;
                }
            }
            else {
                var nextLight;
                if(!map.getLight(map.getCurrentTile(this.x, this.y)).isOn) {
                    alert("You have died!\n\nTIP: \""+tips[Math.floor(Math.random() * tips.length)]+"\"\n\nScore: "+score);
                    window.location.reload();
                }

                if (this.actualDirection === 0) {   //Still
                    nextLight = map.getLight(map.getNextTile(this.x,this.y,this.nextDirection));
                    if(nextLight !== undefined && nextLight.isOn)
                        this.actualDirection = this.nextDirection;
                }
                else if(this.nextDirection === this.actualDirection) {   //Straight
                    nextLight = map.getLight(map.getNextTile(this.x,this.y,this.nextDirection));
                    if((nextLight === undefined || !nextLight.isOn) && isCentered(this.x, this.y)){
                        this.actualDirection = 0;
                    } else {
                        this.nextDirection = this.actualDirection; //Continue
                    }
                }
                else {          //Changing direction
                    if(isCentered(this.x, this.y)) {
                        nextLight = map.getLight(map.getNextTile(this.x,this.y,this.nextDirection));
                        if (nextLight === undefined || !nextLight.isOn) {
                            var nextLightIfStraight = map.getLight(map.getNextTile(this.x,this.y,this.actualDirection));
                            if (nextLightIfStraight === undefined || !nextLightIfStraight.isOn) {
                                this.actualDirection = 0;
                            }
                        }
                        else
                            this.actualDirection = this.nextDirection;
                    }
                }
            }

            this.nextDirection = this.actualDirection;

            //Update sprite position
            switch(this.actualDirection) {
                case directions.UP:
                    this.y -= this.velocity;
                    break;
                case directions.LEFT:
                    this.x -= this.velocity;
                    break;
                case directions.RIGHT:
                    this.x += this.velocity;
                    break;
                case directions.DOWN:
                    this.y += this.velocity;
                    break;
            }
        },
    });
}

isCentered = function(x, y) {
    var currentTile = map.getCurrentTile(x,y);
    return (x === currentTile.x*lightSize && y === currentTile.y*lightSize);
};

function Battery(map, x, y) {
    var batteryImg = new Image();
    batteryImg.src = './assets/imgs/battery.png';
    var batterySpriteSheet = kontra.spriteSheet({
        image: batteryImg,
        frameWidth:  6,
        frameHeight: 12,
        animations:  {
            green: {
                frames: 1
            }
        }
    });

    this.isActive = true;
    this.x = x+3;
    this.y = y;

    this.sprite = kontra.sprite({
        x: x+3,
        y: y,
        animations: batterySpriteSheet.animations,

        update: function() {
        }
    });
    this.sprite.playAnimation('green');
}

Battery.prototype.hide = function() {
    this.isActive = false;
    this.sprite.playAnimation('off');
};

Battery.prototype.appear = function(x, y) {
    var currentLight = map.getLight(map.getCurrentTile(x, y));
    if (currentLight.isOn) {
        this.isActive = true;
        this.sprite.x = x+3;
        this.sprite.y = y;
        this.sprite.playAnimation('green');
    }
};

function Light (x,y) {
    var lightsImg = new Image();
    lightsImg.src = './assets/imgs/lights.png';

    var spriteSheet = kontra.spriteSheet({
        image: lightsImg,
        frameWidth:  12,
        frameHeight: 12,
        animations: {
            shine: {
                frames: [1,2,3],
                frameRate: 2,
                loop: true,
            },
            blink: {
                frames: [1,2,4,1,2,4,1,2,4,1,2,4,1,2,4,1,2,4,1,2,4,1,4],
                frameRate: 3.5,
                loop: false
            }
        }
    });
    this.x = x;
    this.y = y;
    this.isOn = true;
    this.sprite = kontra.sprite({
        x: this.x,
        y: this.y,
        animations: spriteSheet.animations
    });

    this.sprite.playAnimation('shine');

    Light.prototype.turnOff = function() {
        this.sprite.playAnimation('blink');
        var self = this;
        setTimeout(function () {self.isOn = false;}, 6500);
    };
}


const directions = {
    STOP:  0,
    UP:    1,
    RIGHT: 2,
    DOWN:  3,
    LEFT:  4
};

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

Array.prototype.inArray = function(comparer) {
    for(var i=0; i < this.length; i++) {
        if(comparer(this[i])) return true;
    }
    return false;
};

Array.prototype.pushIfNotExist = function(element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
    }
};

var lightSize = 15;

function LightMap (numRows, numCols) {
    this.mapOfLights = [];
    this.mapTemplate = [
        [1,1,1,1,1,1,1,1,1,1,1 ,1,1,1,1,1,1,1,1,1,1,1],  // 1
        [1,0,0,0,1,0,0,0,0,0,0 ,0,0,1,0,1,0,0,0,0,0,1],  // 2
        [1,0,1,1,1,1,1,1,1,1,1 ,1,1,1,0,1,1,1,1,1,0,1],  // 3
        [1,0,1,0,0,0,1,0,1,0,0 ,0,0,1,0,1,0,0,0,1,0,1],  // 4
        [1,1,1,1,1,1,1,1,1,1,0 ,0,1,1,1,1,1,1,1,1,1,1],  // 5
        [1,0,0,0,1,0,0,0,0,1,1 ,1,1,0,0,0,0,1,0,0,0,1],  // 6
        [1,0,0,0,1,1,1,1,0,1,0 ,0,1,1,1,1,1,1,1,1,1,1],  // 7
        [1,1,1,1,1,0,0,1,1,1,0 ,0,1,0,1,0,1,0,0,0,0,1],  // 8
        [1,0,1,0,0,0,0,1,0,1,0 ,0,1,0,1,0,1,0,0,0,0,1],  // 9
        [1,0,1,1,1,1,1,1,1,1,0 ,0,1,0,1,1,1,1,1,1,1,1],  //10
        [1,0,1,0,0,1,0,0,0,1,1 ,1,1,0,1,0,1,0,0,1,0,1],  //11
        [1,1,1,1,1,1,1,1,1,1,0 ,0,1,1,1,1,1,1,1,1,1,1],  //12
        // 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 2 2 2
        // 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2
    ];

    this.corners = [
        {x: 0, y: 0},
        {x: 0, y:11},
        {x:21, y: 0},
        {x:21, y:11}
    ];

    this.offCorners = [];

    for (row = 0; row < numRows; row++){
        var columns = [];
        for (col = 0; col < numCols; col++){
            if(this.mapTemplate[row][col] === 1) {
                columns[col] = new Light(col * lightSize, row * lightSize);
            }
            else
                columns[col] = undefined
        }
        this.mapOfLights[row] = columns;
    }
}

LightMap.prototype.turnOff = function() {
    var corner = this.corners.shift();
    console.log("CORNERS: "+this.corners.length);
    console.log("   Acual corner: {"+corner.x+","+corner.y+"}");

    //Turn off lights
    for(var d=1; d<=4; d++ ) {
        var light = this.getLight(corner);
        light.turnOff();

        light = this.getLight(this.getNextTile(light.x, light.y, d));
        while(light !== undefined && light.isOn && !this.isACrossroad(light.x, light.y)) {
            light.turnOff(light.x, light.y);
            light = this.getLight(this.getNextTile(light.x, light.y, d));
        }
        if(light !== undefined && light.isOn) {
            this.corners.pushIfNotExist({x: Math.floor(light.x / lightSize) , y: Math.floor(light.y / lightSize)} ,function(c) {
                return c.x === Math.floor(light.x / lightSize) && c.y === Math.floor(light.y / lightSize);
            });
        }
    }
    this.offCorners.unshift(corner);
};

LightMap.prototype.turnOffRandomCorner = function() {
    if(this.corners.length > 0) {
        this.turnOff();
    }
};

LightMap.prototype.isACrossroad = function(x,y) {
    if(this.getCurrentTile(x,y) === undefined)
        return false;
    var roads = 0;

    for(var d=1; d<=4; d++){
        if(this.tileExists(this.getNextTile(x,y,d)))
            roads++;
    }
    return roads >= 3;
};

LightMap.prototype.tileExists= function(tile) {
    if(!this.isTileInsideMap(tile))
        return false;
    return this.getLight(tile) !== undefined;

};

LightMap.prototype.getCurrentTile = function(x,y) {
    return {
        x: Math.floor(x / lightSize),
        y: Math.floor(y / lightSize),
    };
};

LightMap.prototype.getNextTile= function(x,y,direction) {
    var currentTile = this.getCurrentTile(x,y);
    var nextTile = {x: currentTile.x, y: currentTile.y};
    switch(direction) {
        case directions.UP:
            nextTile.y -= 1;
            break;
        case directions.LEFT:
            nextTile.x -= 1;
            break;
        case directions.RIGHT:
            nextTile.x += 1;
            break;
        case directions.DOWN:
            nextTile.y += 1;
            break;
    }
    return nextTile;
};

LightMap.prototype.isTileInsideMap = function(tile) {
    return tile.y in this.mapOfLights && tile.x in this.mapOfLights[0];
};

LightMap.prototype.getLight = function(tile) {
    if(!this.isTileInsideMap(tile))
        return undefined;
    return this.mapOfLights[tile.y][tile.x];
};


function Enemy(player, battery ,map,x,y){
    var enemyImg = new Image();
    enemyImg.src = './assets/imgs/enemy.png';

    var enemySpriteSheet = kontra.spriteSheet({
        image: enemyImg,
        frameWidth:  11,
        frameHeight: 12,
        animations: {
            move: {
                frames: [1, 2],
                frameRate: 6,
            }
        }
    });

    this.sprite = kontra.sprite({
        x: x,
        y: y,
        last_x: x,
        last_y: y,
        velocity :1,
        actualDirection: 0,
        nextDirection:   1,
        animations: enemySpriteSheet.animations,

        update: function() {
            this.animations.move.update();

            if(getDistance(player.sprite.x,player.sprite.y,this.x, this.y) <= 10) {
                alert("You have died!\n\nTIP: \""+tips[Math.floor(Math.random() * tips.length)]+"\"\n\nScore: "+score);
                window.location.reload();
            }

            if(map.isACrossroad(this.x, this.y)) {
                if (player.sprite.x > this.x && map.getNextTile(this.x, this.y, 2))
                    this.nextDirection = 2;
                else if (player.sprite.x <= this.x && map.getNextTile(this.x, this.y, 4))
                    this.nextDirection = 4;
                if (player.sprite.y > this.y && map.getNextTile(this.x, this.y, 3))
                    this.nextDirection = 3;
                else if (player.sprite.y < this.y && map.getNextTile(this.x, this.y, 1))
                    this.nextDirection = 1;

                if (this.last_x === this.x && this.last_y === this.y) {
                    this.actualDirection = this.nextDirection;
                    while (this.actualDirection === this.nextDirection) {
                        this.nextDirection = Math.floor(Math.random() * 3) + 1;
                    }

                }
            }

            this.last_x = this.x;
            this.last_y = this.y;

            var nextTile = map.getNextTile(this.x, this.y, this.nextDirection);
            if(!map.isTileInsideMap(nextTile)) {
                if((this.nextDirection === this.actualDirection) && isCentered(this.x, this.y)
                    || (this.x === 0 && this.y === 0 && isCentered(this.x, this.y)) || (this.x === 315 && this.y === 0)
                    || (this.x === 315 && this.y === 165) || (this.x === 0 && this.y === 165))
                {
                    this.actualDirection = 0;
                }
            }
            else {
                var nextLight;
                if (this.actualDirection === 0) {   //Still
                    nextLight = map.getLight(map.getNextTile(this.x,this.y,this.nextDirection));
                    if(nextLight !== undefined)
                        this.actualDirection = this.nextDirection;
                }
                else if(this.nextDirection === this.actualDirection) {   //Straight
                    nextLight = map.getLight(map.getNextTile(this.x,this.y,this.nextDirection));
                    if((nextLight === undefined) && isCentered(this.x, this.y)){
                        this.actualDirection = 0;
                    } else {
                        this.nextDirection = this.actualDirection; //Continue
                    }
                }
                else {          //Changing direction
                    if(isCentered(this.x, this.y)) {
                        nextLight = map.getLight(map.getNextTile(this.x,this.y,this.nextDirection));
                        if (nextLight === undefined) {
                            var nextLightIfStraight = map.getLight(map.getNextTile(this.x,this.y,this.actualDirection));
                            if (nextLightIfStraight === undefined) {
                                this.actualDirection = 0;
                            }
                        }
                        else
                            this.actualDirection = this.nextDirection;
                    }
                }
            }

            this.nextDirection = this.actualDirection;
            if(this.nextDirection === 0)
                this.nextDirection = Math.floor(Math.random() * 3) + 1;

            //Update sprite position
            switch(this.actualDirection) {
                case directions.UP:
                    this.y -= this.velocity;
                    break;
                case directions.LEFT:
                    this.x -= this.velocity;
                    break;
                case directions.RIGHT:
                    this.x += this.velocity;
                    break;
                case directions.DOWN:
                    this.y += this.velocity;
                    break;
            }
        },

        render: function(x,y) {
            this.animations.move.render({x:x, y:y});
        }
    });
}

isCentered = function(x, y) {
    var currentTile = map.getCurrentTile(x,y);
    return (x === currentTile.x*lightSize && y === currentTile.y*lightSize);
};

getDistance = function (x1,y1,x2,y2) {
    var x = x1-x2;
    var y = y1-y2;
    return Math.sqrt(x*x + y*y);
};
