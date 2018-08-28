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
                if(this.x === 0 && this.y === 0 || this.x === 21 && this.y === 0 || this.x === 21 && this.y === 11 || this.x === 0 && this.y === 11 || this.nextDirection === this.actualDirection && map.isCentered(this.x, this.y)){
                    console.log("%c Siguiente está fuera del mapa");
                    this.actualDirection = 0;
                    this.nextDirection = 0;
                }
            }
            else {
                var nextLight;
                if (this.actualDirection === 0) {   //Still
                    this.actualDirection = this.nextDirection;
                }
                else if(this.nextDirection === this.actualDirection) {   //Straight
                    this.nextDirection = this.actualDirection;           //Continue
                }
                else {  //Spinning
                    if( map.isCentered(this.x, this.y) )
                        this.actualDirection = this.nextDirection;
                    else
                        this.nextDirection = this.actualDirection;
                }

                nextLight = map.getLight(map.getNextTile(this.x,this.y,this.nextDirection));


                if(this.nextDirection === this.actualDirection && nextLight === undefined && map.isCentered(this.x, this.y)) {
                    this.actualDirection = 0;
                    this.nextDirection   = 0;
                    console.log("%c RECTO: Siguiente no existe y para", "background: black; color:pink");
                }
            }

            this.nextDirection = this.actualDirection;
            console.log(nextTile);


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


