var batteryImg = new Image();
batteryImg.src = './assets/imgs/battery.png';
var batterySpriteSheet = kontra.spriteSheet({
    image: batteryImg,
    frameWidth:  6,
    frameHeight: 12,
    animations:  {
        off: {
            frames: 4,
        },
        green: {
            frames: 1
        }
    }
});

function Battery(x, y){
    this.isActive = true;
    this.sprite = kontra.sprite({
        x: x+3,
        y: y,
        animations: batterySpriteSheet.animations
    });

    this.sprite.playAnimation('green');
}

Battery.prototype.hide = function() {
    this.isActive = false;
    this.sprite.playAnimation('off');
};

Battery.prototype.appear = function(x,y) {
    this.isActive = true;
    this.sprite.x = x+3;
    this.sprite.y = y;
    this.sprite.playAnimation('green');
};