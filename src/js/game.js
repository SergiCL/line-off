kontra.init();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width  = 22*15;
canvas.height = 11.8*15+15;

var map     = new LightMap(12, 22);
var player  = new Player(map, 0, 0);
var enemy   = new Enemy(player);
var battery = new Battery(0,120);

var score  = 0;
var power  = 100;

setInterval(function(){ map.turnOffRandomCorner(); }, 22000);
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
    update: function () {
        player.sprite.update();
        enemy.sprite.update();

        map.mapOfLights.forEach(function(row) {
            row.forEach(function(light) {
                if(light != null)
                    light.sprite.update();
            });
        });

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
            var corner = onLights[Math.floor(Math.random()*onLights.length)];
            battery.appear(corner.x, corner.y);
        }


    },
    render: function () {
        map.mapOfLights.forEach(function(row) {
            row.forEach(function(light) {
                if(light != null)
                    light.sprite.render({x:light.x, y:light.y});
            });
        });
        battery.sprite.render(battery.x, battery.y);
        player.sprite.render(player.sprite.x, player.sprite.y);
        enemy.sprite.render(0, 164);

        ctx.font = "9px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "right";
        ctx.fillText("Score: "+score+"   Power: "+power+" %", canvas.width-6, canvas.height);

    }
});


loop.start();