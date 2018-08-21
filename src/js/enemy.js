function Enemy(player){
    this.player = player;
    this.sprite = kontra.sprite({
        x: 150,
        y: 60,
        color: 'orange',
        radius: 4,

        update: function() {
            if(this.collidesWith(player.sprite)) {
                alert("You lose!");
                resetGame();
            }

        },

        render: function() {
            this.context.fillStyle = this.color;
            this.context.beginPath();
            this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            this.context.fill();
        }
    });
}


function resetGame() {
    player.sprite.x = 140;
    player.sprite.y = 90;
}