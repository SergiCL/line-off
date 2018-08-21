var img = new Image();
img.src = './assets/imgs/lights.png';

var spriteSheet = kontra.spriteSheet({
    image: img,
    frameWidth: 22.5,
    frameHeight: 14,
    animations: {
        shine: {
            frames: [1,2,3],
            frameRate: 4,
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

function Line (x, y, numOfPoints) {
    this.x = x;
    this.y = y;
    this.isOn = true;
    //this.isHorizontal = isHorizontal;

    this.lightList = new Array();
    this.lightWidth = 20;

    for (i=0; i < numOfPoints; i++) {
        this.lightList.push(new Light(this.x + this.lightWidth*i, 20));
    }

    Line.prototype.turnOff = function() {
        this.lightList.forEach(function(light) {
            light.turnOff(light.x, light.y);
            console.log("Turned Off");
        });
        this.isOn = false;
    }

    Line.prototype.turnOn = function() {
        this.lightList.forEach(function(light) {
            light.turnOn(light.x, light.y);
            console.log("Turned On");
        });
        this.isOn = true;
    }
}