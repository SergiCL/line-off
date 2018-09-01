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
    //this.numRows = numRows;
    //this.numCols = numCols;
    this.mapOfLights = [];
    this.mapTemplate = [
        [1,1,1,1,1,1,1,1,1,1,1  ,1,1,1,1,1,1,1,1,1,1,1],  // 1
        [1,0,0,0,1,0,0,0,0,0,0  ,0,0,1,0,1,0,0,0,0,0,1],  // 2
        [1,0,1,1,1,1,1,1,1,1,1  ,1,1,1,0,1,1,1,1,1,0,1],  // 3
        [1,0,1,0,0,0,1,0,1,0,0  ,0,0,1,0,1,0,0,0,1,0,1],  // 4
        [1,1,1,1,1,1,1,1,1,1,0  ,0,1,1,1,1,1,1,1,1,1,1],  // 5
        [1,0,0,0,1,0,0,0,0,1,1  ,1,1,0,0,0,0,1,0,0,0,1],  // 6
        [1,0,0,0,1,1,1,1,0,1,0  ,0,1,1,1,1,1,1,1,1,1,1],  // 7
        [1,1,1,1,1,0,0,1,1,1,0  ,0,1,0,1,0,1,0,0,0,0,1],  // 8
        [1,0,1,0,0,0,0,1,0,1,0  ,0,1,0,1,0,1,0,0,0,0,1],  // 9
        [1,0,1,1,1,1,1,1,1,1,0  ,0,1,0,1,1,1,1,1,1,1,1],  //10
        [1,0,1,0,0,1,0,0,0,1,1  ,1,1,0,1,0,1,0,0,1,0,1],  //11
        [1,1,1,1,1,1,1,1,1,1,0  ,0,1,1,1,1,1,1,1,1,1,1],  //12
        // 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 2 2 2
        // 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2
    ];

    this.corners = [
        {x: 0, y: 0},
        {x: 0, y:11},
        {x:21, y: 0},
        {x:21, y:11}
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

LightMap.prototype.turnOff = function() {
    var corner = this.corners.shift();

    console.log("CORNERS: "+this.corners.length);
    console.log("   Acual corner: {"+corner.x+","+corner.y+"}");

    /*/Turn off corner if is not a corner never more:
    if(!this.isACrossroad(light.x, light.y)) {
        console.log("TURN OFF: Crossroad")
        light.turnOff(light.x, light.y);
        this.corners.remove(cornerIdx);
        //Delete corner
    }
    */

    //Turn off lights
    for(var d=1; d<=4; d++ ) {
        var light = this.getLight(corner);
        light.turnOff(light.x, light.y);
        console.log("DIRECTION: "+d+". 1st LIGHT: [ "+light.x+","+light.y+" ]");

        light = this.getLight(this.getNextTile(light.x, light.y, d));
        while(light !== undefined && !this.isACrossroad(light.x, light.y)) {
            light.turnOff(light.x, light.y);
            light = this.getLight(this.getNextTile(light.x, light.y, d));
        }
        if(light !== undefined && light.isOn) {
            console.log("   >>> IS A CROSSROAD: [ "+light.x+","+light.y+" ]");
            this.corners.pushIfNotExist({x: Math.floor(light.x / lightSize) , y: Math.floor(light.y / lightSize)} ,function(c) {
                return c.x === Math.floor(light.x / lightSize) && c.y === Math.floor(light.y / lightSize);
            });
        }

    }


    //Apagar linea desde CORNER hsata el siguiente cruce (en una sola dirección)
    //Add siguiente cruce a corners
    //Si no quedan direcciones también apaga el corner (Es decir, si ya no es cruce, solo es linea)
};

LightMap.prototype.turnOffRandomCorner = function() {
    if(this.corners.length > 0) {
        console.log("Turned off a random corner")
        this.turnOff();
        console.log("END: Turned off a random corner")
    }
    else
        console.log("/!\ No quedan corners")
};

LightMap.prototype.isACrossroad = function(x,y) {
    if(this.getCurrentTile(x,y) === undefined)
        return false;
    var roads = 0;

    for(var d=1; d<=4; d++ ){
        if(this.tileExists(this.getNextTile(x,y,d)))
            roads++;
    }
    return roads >= 3;
};

LightMap.prototype.tileExists= function(tile) {
    if(!this.isTileInsideMap(tile))
        return false;
    if(this.getLight(tile) === undefined)
        return false;
    return true;
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