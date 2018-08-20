kontra.init();

var canvas = document.getElementById("canvas");

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
            this.animations.shine.render({x:this.x, y:this.y});
        }
    });

    Light.prototype.turnOff = function() {
       this.sprite =  kontra.sprite({
           animations: spriteSheet.animations,

           update: function () {
               this.animations.off.update();
           },

           render: function () {
               this.animations.off.render({x:this.x, y:this.y});
           }
       });
    };

    Light.prototype.turnOn = function() {
        this.sprite =  kontra.sprite({
            animations: spriteSheet.animations,

            update: function () {
                this.animations.shine.update();
            },

            render: function () {
                this.animations.shine.render({x:this.x, y:this.y});
            }
        });
    }
}

function Line (first_x, y, numOfPoints, isHorizontal) {
    this.first_x = first_x;
    this.y = y;
    this.numOfPoints = numOfPoints;
    this.isHorizontal = isHorizontal;

    this.lightList = new Array();
    this.lightWidth = 20;

    for (i=0; i < numOfPoints; i++) {
        this.lightList.push(new Light(this.first_x + this.lightWidth*i, 20));
    }

    Line.prototype.turnOff = function() {
        line1.lightList.forEach(function(light) {
            light.turnOff();
        });
    }

    Line.prototype.turnOn = function() {
        line1.lightList.forEach(function(light) {
            light.turnOn();
        });
    }
}

var line1 = new Line(20,10,13,true);

/*Player*/
var player = kontra.sprite({
    x: 140,
    y: 90,
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
            line1.turnOff();
            resetGame();
        }
    }
});

var enemy = kontra.sprite({
    x: 150,
    y: 60,
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
    player.y = 90;
}


var loop  = kontra.gameLoop({
    update: function () {
        player.update();
        enemy.update();

        line1.lightList.forEach(function(light) {
            light.sprite.update();
        });
    },
    render: function () {
        line1.lightList.forEach(function(light) {
            light.sprite.render({x:light.x, y:light.y});
        });
        player.render();
        enemy.render();
    }
});

loop.start();