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

            if(getDistance(player.sprite.x,player.sprite.y,this.x, this.y) <= 10) {
                alert("The monster killed you. Game Over!");
                window.location.reload();
            }

            this.nextDirection = Math.floor(Math.random()*3)+1;
            //TODO: If bateria.sprite.x > this.x--> Va a la derecha
            //TODO: If bateria.sprite.x < this.x--> Va a la izquierda
            //TODO: If bateria.sprite.y > this.y--> Va hacia abajo
            //TODO: If bateria.sprite.y < this.y--> Va hacia arriba
            //TODO: If distancia con bateria > 3 casillas --> Se acerca
            //TODO: ELSE da vueltas a la zona.

            //TODO: If está en la sombra: Desaparece.

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

getDistance = function (x1,y1,x2,y2) {
    var x = x1-x2;
    var y = y1-y2;
    return Math.sqrt(x*x + y*y);
};