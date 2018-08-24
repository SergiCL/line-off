var playerImg = new Image();
playerImg.src = './assets/imgs/player.png';

function Player(map, x, y){
    this.sprite = kontra.sprite({
        x: x,
        y: y,
        actualDirection: 0, //0,1,2,3,4 --> Stop (initial), Up, Right, Down, Left.
        nextDirection:   0,
        image:   playerImg,

        update: function() {

            //Key capture
            if (kontra.keys.pressed('left'))
                //this.nextDirection = 4;
                this.x-= 1;

            if (kontra.keys.pressed('right'))
                //this.nextDirection = 2;
                this.x += 1;

            if (kontra.keys.pressed('up'))
                //this.nextDirection = 1;
                this.y -= 1;

            if (kontra.keys.pressed('down'))
                //this.nextDirection = 3;
                this.y += 1;

            /*    //Actualizar casilla
            var x_tile = Math.floor(lightSize*this.x/canvas.height);
            var y_tile = Math.floor(lightSize*this.y/canvas.width);
            var next_x = this.x;
            var next_y = this.x;

            switch(this.nextDirection) {
                case 1:
                    y_tile-= 1;
                    break;
                case 2:
                    x_tile += 1;
                    break;
                case 3:
                    y_tile += 1;
                    break;
                case 4:
                    x_tile -= 1;
                    break;
            }

            //console.log("X Tile: "+x_tile+" Y Tile: "+y_tile+" | Actual direction: "+this.actualDirection);


            if(x_tile < 0 || x_tile > 22 || y_tile < 0 || y_tile > 12){
                if (this.x === x_tile*canvas.height/lightSize && this.y === y_tile*canvas.width/lightSize) {    //Tile center
                    this.actualDirection = 0;
                    console.log("Casilla 0")
                }
            }


            else {
                var nextTile = map.mapOfLights[x_tile][y_tile];
                console.log("Next Tile: "+nextTile);

                if (nextTile === undefined) {
                    this.nextDirection = this.actualDirection;
                    console.log("       - If --> nextDirection: "+this.nextDirection)
                } else { // if (this.x === x_tile*canvas.height/lightSize && this.y === y_tile*canvas.width/lightSize) {    //Tile center
                    this.actualDirection = this.nextDirection;
                    console.log("       - En el centro de la casilla")
                }
            }

            //Actualizar posición del sprite
            switch(this.actualDirection) {
                case 1:
                    this.y -= 1;
                    break;
                case 2:
                    this.x += 1;
                    break;
                case 3:
                    this.y += 1;
                    break;
                case 4:
                    this.x -= 1;
                    break;
            }
            */



            var currentTile = map.getCurrentTile(this.x, this.y);
            console.log("Actual tile: ["+currentTile.x+" - "+currentTile.y+"]");

        },
    });
}

getCasillaActual = function(posicion) {



};


Player.prototype.getNextTile = function(direction) {

};





