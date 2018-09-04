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

function Enemy(player,map,x,y){
    this.player = player;
    var self = this;
    this.sprite = kontra.sprite({
        x: x,
        y: y,
        actualDirection: 0,
        nextDirection:   0,
        animations: enemySpriteSheet.animations,

        update: function() {
            this.animations.move.update();

            /*
            if(Math.round(player.sprite.x/lightSize) === 0) {
                console.log("  ")
            }
            */

            this.nextDirection = Math.floor(Math.random()*3)+1;

            //Calculos
            var nextTile = map.getNextTile(this.x, this.y, this.nextDirection);
            if(!map.isTileInsideMap(nextTile)) {
                //Evita que se pare a medio camino
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
                    this.y -= 1;
                    break;
                case directions.LEFT:
                    this.x -= 1;
                    break;
                case directions.RIGHT:
                    this.x += 1;
                    break;
                case directions.DOWN:
                    this.y += 1;
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