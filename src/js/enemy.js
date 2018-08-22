var enemyImg = new Image();
enemyImg.src = './assets/imgs/enemy.png';

var enemySpriteSheet = kontra.spriteSheet({
    image: enemyImg,
    frameWidth:  11,
    frameHeight: 12,
    animations: {
        move: {
            frames: [1, 2],
            frameRate: 6,
        }
    }
});

function Enemy(player){
    this.player = player;
    this.sprite = kontra.sprite({
        x: 150,
        y: 60,
        animations: enemySpriteSheet.animations,

        update: function() {
            /*
            if(this.collidesWith(player.sprite)) {
                resetGame();

                if (line1.isOn) {
                    alert("Turn Off!");
                    line1.turnOff();
                } else {
                    alert("Turn On!");
                    line1.turnOn();
                }
            }
            */
            this.animations.move.update();
        },

        render: function(x,y) {
            this.animations.move.render({x:x, y:y});
        }
    });
}

function resetGame() {
    player.sprite.x = 140;
    player.sprite.y = 90;
}