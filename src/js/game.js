kontra.init();

var canvas  = document.getElementById("canvas");

canvas.width  = 22*15;
canvas.height = 11.8*15;

var map    = new LightMap(12, 22);
var player = new Player(map, 0, 0);
var enemy  = new Enemy(player);

kontra.keys.bind('enter', function() {
    map.turnOffRandomCorner();
});

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
    },
    render: function () {
        map.mapOfLights.forEach(function(row) {
            row.forEach(function(light) {
                if(light != null)
                    light.sprite.render({x:light.x, y:light.y});
            });
        });

        player.sprite.render(player.sprite.x, player.sprite.y);
        enemy.sprite.render(0, 164);
    }
});

loop.start();