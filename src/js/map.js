const directions = {
    STOP:  0,
    UP:    1,
    RIGHT: 2,
    DOWN:  3,
    LEFT:  4
};

var lightSize = 15;

function LightMap (numRows, numCols) {
    //this.numRows = numRows;
    //this.numCols = numCols;
    this.mapOfLights = [];
    this.mapTemplate = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // 1
        [1,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1],  // 2
        [1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1],  // 3
        [1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1],  // 4
        [1,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,1],  // 5
        [1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1],  // 6
        [1,0,1,0,1,1,1,1,0,1,0,0,1,0,1,1,1,1,0,1,0,1],  // 7
        [1,0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,1],  // 8
        [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],  // 9
        [1,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,1],  //10
        [1,0,1,0,0,1,0,0,0,1,1,1,1,0,0,0,1,0,0,1,0,1],  //11
        [1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],  //12
        // 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 2 2 2
        // 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2
    ];

    for (row = 0; row < numRows; row++){
        var columns = [];
        for (col = 0; col < numCols; col++){
            if(this.mapTemplate[row][col] === 1)
                columns[col] = new Light(col*lightSize, row*lightSize);
            else
                columns[col] = undefined
        }
        this.mapOfLights[row] = columns;
    }

}

LightMap.prototype.turnOff = function(x,y,isHorizontal) {
    while (this.mapOfLights[x][y] != null) {
        var light = this.mapOfLights[x][y];
        light.turnOff(light.x, light.y);
        if(isHorizontal)
            y+=1;
        else
            x+=1;
    }
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
  return this.mapOfLights[tile.y][tile.x];
};

LightMap.prototype.getNextLight = function(x,y,direction) {
    var nextTile = this.getNextTile(x,y,direction);



    if(!(nextTile.y in this.mapOfLights) || !(nextTile.x in this.mapOfLights[0])) {
        light = undefined
        console.log("El siguiente está fuera del mapa ["+nextTile.x+","+nextTile.y+"]")
    }
//    if(nextTile.x < 0 || nextTile.y < 0 || nextTile.x > this.mapOfLights.length || nextTile.y > this.mapOfLights[0].length)
  //      throw index

    var light;
    try {
        light = this.mapOfLights[nextTile.y][nextTile.x];
    }catch (e) {
        light = undefined
    }
    return light;
};