import { http_server } from "@/config";
import axios from "axios";

type shape = {
    type : string,
    x : number ,
    y : number ,
    width : number ,
    height : number
} 

export async function drawon(canvas : HTMLCanvasElement,roomId : string , socket : WebSocket){

    const existingShape : shape[] = await getExistingContent(roomId);

    const ctx = canvas.getContext('2d');

    if(!ctx){
        return ;
    }

    socket.onmessage = (event)=>{
        const msg = JSON.parse(event.data);
        if(msg.type === "chat"){
            const parsedmsg = JSON.parse(msg.message);
            existingShape.push(parsedmsg);
            clearCanvas(canvas,ctx,existingShape);
        }
    }

    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = "rgba(255,255,255)"

    clearCanvas(canvas,ctx,existingShape);

    let startx = 0;
    let starty = 0;
    let width = 0;
    let height = 0;
    let clicked = false ;
    canvas.addEventListener("mousedown",(e)=>{
        clicked = true ;
        startx = e.offsetX ;
        starty = e.offsetY ;
    })
    canvas.addEventListener("mousemove",(e)=>{
        if(clicked){
            width = e.offsetX - startx ;
            height = e.offsetY - starty;

            clearCanvas(canvas,ctx,existingShape);
            ctx.strokeStyle = "rgba(255,255,255)"
            ctx.strokeRect(startx,starty,width,height)
        }
    })
    canvas.addEventListener("mouseup",(e)=>{
        clicked = false ;
        width = e.offsetX - startx;
        height = e.offsetY - starty;
        ctx.strokeStyle = "rgba(255,255,255)"
        ctx.strokeRect(startx,starty,width,height)
        existingShape.push({
            type:"rect",
            x:startx,
            y:starty,
            width:width,
            height:height
        })

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                type:"rect",
                x:startx,
                y:starty,
                width:width,
                height:height
            }),
            roomId
        }))
    })
}

export function clearCanvas(canvas : HTMLCanvasElement , ctx : CanvasRenderingContext2D , existingShape : shape[]){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    existingShape.map(s =>{
        ctx.strokeStyle = "rgba(255,255,255)"
        ctx.strokeRect(s.x,s.y,s.width,s.height);
    })
}

export async function getExistingContent(roomId : string){
    const res = await axios.get(`${http_server}/chats/${roomId}`);
    const messages = res.data.messages ;

    const shapes = messages.map((s : {message: string})=> {
        const parsedData = JSON.parse(s.message);
        return parsedData;
    })

    return shapes ; 
}