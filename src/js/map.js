var lightSize = 15;

function LightMap (numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.mapOfLights = [];
    this.mapTemplate = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // 1
        [1,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1],  // 2
        [1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1],  // 3
        [1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1],  // 4
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
        y: Math.floor(y / lightSize)
    };

};

LightMap.prototype.getNextTile = function(x,y,direction) {



};