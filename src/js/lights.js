var lightsImg = new Image();
lightsImg.src = './assets/imgs/lights.png';

var spriteSheet = kontra.spriteSheet({
    image: lightsImg,
    frameWidth:  12,
    frameHeight: 12,
    animations: {
        shine: {
            frames: [1,2,3],
            frameRate: 2.5,
            loop: true
        },
        off: {
            frames: [0],
            frameRate: 0,
            loop: false,
        }
    }
});

function Light (x,y) {
    this.x = x;
    this.y = y;
    this.isOn = true;
    this.sprite = kontra.sprite({
        animations: spriteSheet.animations,

        update: function () {
            this.animations.shine.update();
        },

        render: function () {
            this.animations.shine.render({x:x, y:y});
        }
    });

    Light.prototype.turnOff = function(x,y) {
        this.isOn   = false;
        this.sprite =  kontra.sprite({
            animations: spriteSheet.animations,

            update: function () {
                this.animations.off.update();
            },

            render: function () {
                this.animations.off.render({x:x, y:y});
            }
        });
    };

    Light.prototype.turnOn = function(x,y) {
        this.isOn   = true;
        this.sprite =  kontra.sprite({
            animations: spriteSheet.animations,

            update: function () {
                this.animations.shine.update();
            },

            render: function () {
                this.animations.shine.render({x:x, y:y});
            }
        });
    }
}