var id = "myCanvas";
var canvas;
var ctx;
var Objects = [];


var Shape = function(id,position, velocity, color, mass) {
    this.position = position;
    this.velocity = velocity;
    if(!mass)
        mass = 1
    this.mass = mass;
    this.color = color;
    this.id = id;
    this.history = [];
}
Shape.prototype.update = function() { }
Shape.prototype.draw = function() { }
Shape.prototype.drawHis = function() { }

window['Shape'] = Shape;

var Circle = function(id,position,raio, velocity, color) {
    Shape.call(this,id, position, velocity, color);
    this.raio = raio;
}
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;
window['Circle'] = Circle;

Circle.prototype.update = function() {
    this.draw();
    this.drawHis();
    if (this.position.x + this.raio >= canvas.width || this.position.x - this.raio <= 0){
        this.velocity.x = -this.velocity.x;
    }
    if (this.position.y + this.raio >= canvas.height || this.position.y - this.raio <= 0){
        this.velocity.y = -this.velocity.y;
    }
    this.history.unshift(JSON.parse(JSON.stringify(new Circle(0,this.position,this.raio,{x : 0, y : 0},"#e25822"))));
    if(this.hasCollide());
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
}
Circle.prototype.draw = function(){
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.raio, 0, 2 * Math.PI);
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.fill();
}
Circle.prototype.drawHis = function(){
    if(this.history.length > 1){
        this.history.pop();
    }
    var o = 1;
    for(var i = 0; i < this.history.length;i++){
        ctx.beginPath();
        ctx.arc(this.history[i].position.x, this.history[i].position.y, this.history[i].raio, 0, 2 * Math.PI);
        ctx.strokeStyle = this.history[i].color;
        ctx.fillStyle = this.history[i].color;
        ctx.globalAlpha = o;
        ctx.fill();
        o -= 1/1;
    }
}
Circle.prototype.hasCollide = function() {
    for(var i = 0; i < Objects.length; i++){
        var obj = Objects[i];
        if(obj === this.id) continue; 
        if (distance(this.position.x,this.position.y,obj.position.x,obj.position.y)-this.raio*2<0){
            resolveCollision(this, Objects[i]);
        } 
    }
}

function clear(){
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
}

function run(id){
    var r = 10;
    var v = 1;
    var q = 1000;
    
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth-16;
    canvas.height = window.innerHeight-16;
    for(var i = 0;i<q;i++){
        var posX = randomIntFromRange(r, canvas.width-r);
        var posY = randomIntFromRange(r, canvas.height-r);
        for(var j = 0 ; j < Objects.length;j++){
            if(distance(posX,posY,Objects[j].position.x,Objects[j].position.y)-r*2<0){
                posX = randomIntFromRange(r, canvas.width-r);
                posY = randomIntFromRange(r, canvas.height-r);
                j=-1;                
            }
        }
        Objects.push(new Circle(i,{x:posX,y:posY},r,{x : Math.random()*v, y : Math.random()*v},"#e25822"));
    }
    clear();
    return setInterval(update, 10);
}
function update(){
    clear();
    for(id in Objects){
        Objects[id].update();
    }
}
run(id);

function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1
  
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

 function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.position.x - particle.position.x;
    const yDist = otherParticle.position.y - particle.position.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.position.y - particle.position.y, otherParticle.position.x - particle.position.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}