kontra.init();

kontra.assets.images = 'assets/imgs/';

kontra.loadAssets('background.png','enemy.png','main.png').then(
    function () {
        var background = kontra.sprite({
            x: 0,
            y: 0,
            image: kontra.images.background
        });

        var main = kontra.sprite({
            x: 120,
            y: 240,
            image: kontra.images.main
        });

        var enemy = kontra.sprite({
            x: 120,
            y: 240,
            image: kontra.images.enemy
        });

    }
);




var loop  = kontra.gameLoop({
    update: function () {
        console.log(sprite.x+" - "+sprite.y)
        sprite.update();
    },
    render: function () {
        sprite.render();
    }
});

loop.start();