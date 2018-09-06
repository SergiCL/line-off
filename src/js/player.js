var playerImg = new Image();
playerImg.src = './assets/imgs/player.png';

function Player(map, x, y){
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