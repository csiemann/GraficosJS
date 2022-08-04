var AnimationCanvas = function(id, color,fps) {
    this.id = id;
    this.objects = [];
    this.canvas;
    this.ctx;
    if(!color)
        color = "#e25822";
    this.color = color;
    // this.fps = fps;
    this.tick = 10;
}
AnimationCanvas.prototype.run = function(){
    var r = 5;
    var v = 2;
    var q = 200;
    this.canvas = document.getElementById(this.id);
    var div = getComputedStyle(document.getElementById("div_"+this.id));
    this.canvas.width = div.width.slice(0,-2);
    this.canvas.height = div.height.slice(0,-2);
    this.ctx = this.canvas.getContext("2d");
    for(var i = 0;i<q;i++){
        var posX = randomIntFromRange(r, this.canvas.width-r);
        var posY = randomIntFromRange(r, this.canvas.height-r);
        for(var j = 0 ; j < this.objects.length;j++){
            if(distance(posX,posY,this.objects[j].position.x,this.objects[j].position.y)-r*2<0){
                posX = randomIntFromRange(r, this.canvas.width-r);
                posY = randomIntFromRange(r, this.canvas.height-r);
                j=-1;                
            }
        }
        this.objects.push(new Circle(i,this,{x:posX,y:posY},r,{x : Math.random()*v, y : Math.random()*v},this.color));
    }
    this.clear();
    var me = this;
    return setInterval(function(){me.update()}, this.tick);
}
AnimationCanvas.prototype.update = function(){
    this.clear();
    for(id in this.objects){
        this.objects[id].update();
    }
}
AnimationCanvas.prototype.clear = function(){
    this.ctx.fillStyle = "black";
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.closePath();
    this.ctx.fill();
}
window['AnimationCanvas'] = AnimationCanvas;