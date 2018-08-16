kontra.init();

var canvas = document.getElementById("canvas");

var player = kontra.sprite({
    x: 140,
    y: 65,
    color: 'cyan',
    width: 20,
    height: 20,

    update: function() {
        if (this.x > 0 && kontra.keys.pressed('left')){
            this.x -= 1
        }
        else if (this.x < (canvas.width - this.width) && kontra.keys.pressed('right')) {
            this.x += 1
        }

        if (this.y > 0 && kontra.keys.pressed('up')) {
            this.y -= 1
        }
        else if (this.y < (canvas.height - this.height) && kontra.keys.pressed('down')) {
            this.y += 1
        }

        if(this.collidesWith(enemy)) {
            alert("You lose!");
            resetGame();
        }
    }
});

var enemy = kontra.sprite({
    x: 150,
    y: 40,
    color: 'orange',
    radius: 4,

    render: function() {
        this.context.fillStyle = this.color;

        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.fill();
    }
});

function resetGame() {
    player.x = 140;
    player.y = 65;
    enemy.x = 150;
    enemy.y = 40;
}

var loop  = kontra.gameLoop({
    update: function () {
        player.update();
        enemy.update();
        console.log(player.x+" - "+player.y);
    },
    render: function () {
        player.render();
        enemy.render();
    }
});

loop.start();