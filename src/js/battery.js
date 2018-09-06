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

function Battery(map, x, y) {
    this.isActive = true;
    this.x = x+3;
    this.y = y;

    var self = this;
    this.sprite = kontra.sprite({
        x: x+3,
        y: y,
        animations: batterySpriteSheet.animations,

        update: function() {
            console.log("Battery: {"+this.x+","+this.y+"}   Active: "+self.isActive);
        }
    });
    this.sprite.playAnimation('green');
}

Battery.prototype.hide = function() {
    this.isActive = false;
    this.sprite.playAnimation('off');
};

Battery.prototype.appear = function(x,y) {
    console.log("La batería quiere aparecer");
    var currentLight = map.getLight(map.getCurrentTile(x, y));
    if (currentLight.isOn) {
        console.log("La batería APARECE");
        this.isActive = true;
        this.sprite.x = x+3;
        this.sprite.y = y;
        this.sprite.playAnimation('green');
    } else {
        console.log("La batería NO APARECE");
    }
};