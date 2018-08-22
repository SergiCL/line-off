function Player(canvas){
    this.sprite = kontra.sprite({
        x: 0,
        y: 0,
        color: 'red',
        width: 12,
        height: 12,
        context: canvas.context,

        update: function() {
            //Movement
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
        }
    });
}


