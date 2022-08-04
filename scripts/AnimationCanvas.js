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
    var r = 10;
    var v = 1;
    var q = 100;
    this.canvas = document.getElementById(this.id);
    var div = getComputedStyle(document.getElementById("div_"+this.id));
    this.canvas.width = parseFloat(div.width);
    this.canvas.height = parseFloat(div.height);
    this.canvas.style.width = div.width;
    this.canvas.style.height = div.height;
    this.ctx = this.canvas.getContext("2d");
    var posX = randomIntFromRange(r, this.canvas.width-r);
    var posY = randomIntFromRange(r, this.canvas.height-r);
    this.objects.push(new Circle(0,this,{x:posX,y:posY},1,{x : Math.random()*v, y : Math.random()*v},"rgba(255,255,255,1)", 1, 100));
    for(var i = 0;i<q-1;i++){
        var posX = randomIntFromRange(r, this.canvas.width-r);
        var posY = randomIntFromRange(r, this.canvas.height-r);
        for(var j = 0 ; j < this.objects.length;j++){
            if(distance(posX,posY,this.objects[j].position.x,this.objects[j].position.y)-r*2<0){
                posX = randomIntFromRange(r, this.canvas.width-r);
                posY = randomIntFromRange(r, this.canvas.height-r);
                j=-1;                
            }
        }
        this.objects.push(new Circle(i,this,{x:posX,y:posY},r,{x : Math.random()*v, y : Math.random()*v},this.color,1));
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
    this.ctx.fill();
    this.ctx.closePath();
}
window['AnimationCanvas'] = AnimationCanvas;