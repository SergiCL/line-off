var lightsImg = new Image();
lightsImg.src = './assets/imgs/lights.png';

var spriteSheet = kontra.spriteSheet({
    image: lightsImg,
    frameWidth:  12,
    frameHeight: 12,
    animations: {
        shine: {
            frames: [1,2,3],
            frameRate: 2,
            loop: true,
        },
        blink: {
            frames: [1,2,4,1,2,4,1,2,4,1,2,4,1,2,4,1,2,4,1,2,4,1,4],
            frameRate: 3.5,
            loop: false
        }
    }
});

function Light (x,y) {
    this.x = x;
    this.y = y;
    this.isOn = true;
    this.sprite = kontra.sprite({
        x: this.x,
        y: this.y,
        animations: spriteSheet.animations
    });

    this.sprite.playAnimation('shine');

    Light.prototype.turnOff = function() {
        this.sprite.playAnimation('blink');
        var self = this;
        turningOffTimeout = setTimeout(function () {console.log("Luz apagada"); self.isOn = false;}, 6500);
    };

    Light.prototype.turnOn = function() {
        this.sprite.playAnimation('shine');
        clearTimeout(turningOffTimeout);
        this.isOn   = true;
    };


}