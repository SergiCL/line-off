kontra.init();

var canvas  = document.getElementById("canvas");

canvas.width  = 22*15;
canvas.height = 12*15;

//var line1 = new Line(0,0,22);
var player = new Player(canvas);
var enemy = new Enemy(player);
var map = new LightMap(12, 22);

var loop  = kontra.gameLoop({
    update: function () {
        player.sprite.update();
        enemy.sprite.update();

        /*
        line1.lightList.forEach(function(light) {
            light.sprite.update();
        });
        */
        map.mapOfLights.forEach(function(row) {
            row.forEach(function(light) {
                if(light != null)
                    light.sprite.update();
            });
        });
    },
    render: function () {
        /*line1.lightList.forEach(function(light) {
            light.sprite.render({x:light.x, y:light.y});
        });
        */
        map.mapOfLights.forEach(function(row) {
            row.forEach(function(light) {
                if(light != null)
                    light.sprite.render({x:light.x, y:light.y});
            });
        });

        player.sprite.render();
        //enemy.sprite.render();
    }
});

loop.start();