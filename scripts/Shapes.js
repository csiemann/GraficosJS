var Shape = function(id, animationCanvas, position, velocity, color, mass) {
    this.position = position;
    this.velocity = velocity;
    if(!mass)
        mass = 1
    this.mass = mass;
    this.color = color;
    this.id = id;
    this.history = [];
    this.animationCanvas = animationCanvas;
}
Shape.prototype.update = function() { }
Shape.prototype.draw = function() { }
Shape.prototype.drawHis = function() { }

window['Shape'] = Shape;

var Circle = function(id, animationCanvas, position,raio, velocity, color) {
    Shape.call(this,id, animationCanvas, position, velocity, color);
    this.raio = raio;
}
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;
window['Circle'] = Circle;

Circle.prototype.update = function() {
    this.draw();
    this.drawHis();
    if (this.position.x + this.raio >= this.animationCanvas.canvas.width || this.position.x - this.raio <= 0){
        if(this.position.x + this.raio >= this.animationCanvas.canvas.width){
            this.position.x = this.animationCanvas.canvas.width - this.raio 
        }else{
            this.position.x = this.raio;
        }
        this.velocity.x = -this.velocity.x;
    }
    if (this.position.y + this.raio >= this.animationCanvas.canvas.height || this.position.y - this.raio <= 0){
        if(this.position.y + this.raio >= this.animationCanvas.canvas.height){
            this.position.y = this.animationCanvas.canvas.height-this.raio;
        }else{
            this.position.y = this.raio;
        }
        this.velocity.y = -this.velocity.y;
    }
    this.history.unshift(JSON.parse(JSON.stringify(new Circle(0,this.position,this.raio,{x : 0, y : 0},"#e25822"))));
    if(this.hasCollide());
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
}
Circle.prototype.draw = function(){
    this.animationCanvas.ctx.beginPath();
    this.animationCanvas.ctx.arc(this.position.x, this.position.y, this.raio, 0, 2 * Math.PI);
    this.animationCanvas.ctx.strokeStyle = this.color;
    this.animationCanvas.ctx.globalAlpha = 1;
    this.animationCanvas.ctx.fillStyle = this.color;
    this.animationCanvas.ctx.fill();
}
Circle.prototype.drawHis = function(){
    if(this.history.length > 10){
        this.history.pop();
    }
    var o = 1;
    for(var i = 0; i < this.history.length;i++){
        this.animationCanvas.ctx.beginPath();
        this.animationCanvas.ctx.arc(this.history[i].position.x, this.history[i].position.y, this.history[i].raio, 0, 2 * Math.PI);
        this.animationCanvas.ctx.strokeStyle = this.history[i].color;
        this.animationCanvas.ctx.fillStyle = this.history[i].color;
        this.animationCanvas.ctx.globalAlpha = o;
        this.animationCanvas.ctx.fill();
        o = Math.max(0,o-1/this.history.length);
    }
}
Circle.prototype.hasCollide = function() {
    for(var i = 0; i < this.animationCanvas.objects.length; i++){
        var obj = this.animationCanvas.objects[i];
        if(obj === this.id) continue; 
        if (distance(this.position.x,this.position.y,obj.position.x,obj.position.y)-this.raio*2<0){
            resolveCollision(this, this.animationCanvas.objects[i]);
        } 
    }
}