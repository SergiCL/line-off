var playerImg = new Image();
playerImg.src = './assets/imgs/player.png';

function Player(map, x, y){
    this.sprite = kontra.sprite({
        x: x,
        y: y,
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

            //Calculos
            var nextTile = map.getNextTile(this.x, this.y, this.nextDirection);
            if(!map.isTileInsideMap(nextTile)) {
                if((this.x === 0 && this.y === 0 || this.x === 21 && this.y === 0 || this.x === 21 && this.y === 11 || this.x === 0 && this.y === 11 || this.nextDirection === this.actualDirection) && isCentered(this.x, this.y)){
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
            //console.log(nextTile);
            //console.log("LIGHT: "+nextLight);


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
    });
}

isCentered = function(x, y) {
    var currentTile = map.getCurrentTile(x,y);
    return (x === currentTile.x*lightSize && y === currentTile.y*lightSize);
};