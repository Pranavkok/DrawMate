type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export function clearCanvas(canvas : HTMLCanvasElement , ctx : CanvasRenderingContext2D , existingShape : Shape[]){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    existingShape.map(s =>{
        ctx.strokeStyle = "rgba(255,255,255)"
        if (s.type === "rect") {
            ctx.strokeRect(s.x,s.y,s.width,s.height);
        } else if (s.type === "circle") {
            ctx.beginPath();
            ctx.arc(s.centerX,s.centerY,Math.abs(s.radius),0,Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        } else if (s.type === "pencil") {
            ctx.beginPath();
            ctx.moveTo(s.startX,s.startY);
            ctx.lineTo(s.endX,s.endY)
            ctx.stroke();
            ctx.closePath();
        }
    })
}