var Shape = function(id, animationCanvas, position, velocity, color, mass, shadow) {
    this.position = position;
    this.velocity = velocity;
    if(!mass)
        mass = 1
    this.mass = mass;
    this.color = color;
    this.id = id;
    this.history = [];
    this.animationCanvas = animationCanvas;
    if(!shadow)
        shadow = 0;
    this.shadow = shadow;
}
Shape.prototype.update = function() { }
Shape.prototype.draw = function() { }
Shape.prototype.drawHis = function() { }

window['Shape'] = Shape;

var Circle = function(id, animationCanvas, position,raio, velocity, color, mass, shadow) {
    Shape.call(this,id, animationCanvas, position, velocity, color, mass, shadow);
    this.raio = raio;
}
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;
window['Circle'] = Circle;

Circle.prototype.update = function() {
    if(this.id == 0)
        console.log()
    this.drawHis();
    this.draw();
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
    this.history.unshift(JSON.parse(JSON.stringify(this.position)));
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
    if(this.history.length > this.shadow){
        this.history.pop();
    }
    var o = 1;
    for(var i = 0; i < this.history.length;i++){
        this.animationCanvas.ctx.beginPath();
        this.animationCanvas.ctx.arc(this.history[i].x, this.history[i].y, this.raio, 0, 2 * Math.PI);
        this.animationCanvas.ctx.strokeStyle = this.color;
        this.animationCanvas.ctx.fillStyle = this.color;
        this.animationCanvas.ctx.globalAlpha = o;
        this.animationCanvas.ctx.fill();
        o = Math.max(0,o-1/this.history.length);
    }
}
Circle.prototype.hasCollide = function() {
    for(var i = 0; i < this.animationCanvas.objects.length; i++){
        var obj = this.animationCanvas.objects[i];
        if(obj.id == this.id) continue; 
        if (distance(this.position.x,this.position.y,obj.position.x,obj.position.y)-(this.raio+obj.raio)<=0){
            resolveCollision(this, this.animationCanvas.objects[i]);
        } 
    }
}