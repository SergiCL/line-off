kontra.init();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width  = 22*15;
canvas.height = 11.8*15+15;

var map     = new LightMap(12, 22);
var player  = new Player(map, 0, 0);
var battery = new Battery(map, 0, 0);
var enemy   = new Enemy(player, battery, map, canvas.width-22, 0);

var score  = -50;
var power  =  45;

var toTakeOffTimer = 0;
var toTakeOffLimit = 0;

setInterval(function(){ if(power > 0) power-=1; }, 900);
var onLights = [];

for (row in map.mapOfLights){
    for (col in map.mapOfLights[row]){
        if(map.mapTemplate[row][col] === 1) {
            var tile = {x: col*lightSize, y: row*lightSize};
            if(map.isACrossroad(col*lightSize, row*lightSize))
                onLights.push(tile);
        }
    }
}

var loop  = kontra.gameLoop({
    //TODO: Add Music

    render: function () {
        map.mapOfLights.forEach(function(row) {
            row.forEach(function(light) {
                if(light != null)
                    light.sprite.render({x:light.x, y:light.y});
            });
        });
        battery.sprite.render(battery.x, battery.y);
        player.sprite.render(player.sprite.x, player.sprite.y);
        enemy.sprite.render(enemy.sprite.x, enemy.sprite.y);

        ctx.font = "9px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "right";
        ctx.fillText("Score: "+score+"   Power: "+power+" %", canvas.width-6, canvas.height);
    },
    update: function () {
        player.sprite.update();
        enemy.sprite.update();

        map.mapOfLights.forEach(function(row) {
            row.forEach(function(light) {
                if(light != null)
                    light.sprite.update();
            });
        });

        battery.sprite.update();

        if(toTakeOffLimit > 0 && toTakeOffTimer >= toTakeOffLimit) {
            toTakeOffTimer = 0;
            map.turnOffRandomCorner();
        }

        toTakeOffTimer += 1;

        if(power <= 4) {
            toTakeOffLimit = 4*60;
        }
        else if(power <= 10) {
            toTakeOffLimit = 8*60;
        }
        else if (power <= 25) {
            toTakeOffLimit = 10*60;
        }
        else if(power <= 50) {
            toTakeOffLimit = 20*60;
        }
        else {
            toTakeOffLimit = 0;
            toTakeOffTimer = 0;
        }

        if (!map.getLight(map.getCurrentTile(battery.sprite.x, battery.sprite.y)).isOn) {
            battery.hide();
        }

        if(battery.isActive) {
            if(player.sprite.collidesWith(battery.sprite)) {
                if (power < 95)
                    power += 5;
                else
                    power = 100;
                score += 50;
                battery.hide();
            }
        }
        else {
            var tile = onLights[Math.floor(Math.random()*onLights.length)];
            battery.appear(tile.x, tile.y);
        }

    }
});

loop.start();