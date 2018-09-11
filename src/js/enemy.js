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

function Enemy(player, battery ,map,x,y){
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
            console.log("Enemy direction = "+this.nextDirection);

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