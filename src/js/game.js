kontra.init();

var canvas = document.getElementById("canvas");

var line1 = new Line(20,10,13);
var player = new Player(canvas);
var enemy = new Enemy(player);

function resetGame() {
    player.x = 140;
    player.y = 90;
}

var loop  = kontra.gameLoop({
    update: function () {
        player.sprite.update();
        enemy.sprite.update();

        line1.lightList.forEach(function(light) {
            light.sprite.update();
        });
    },
    render: function () {
        line1.lightList.forEach(function(light) {
            light.sprite.render({x:light.x, y:light.y});
        });
        player.sprite.render();
        enemy.sprite.render();
    }
});

loop.start();