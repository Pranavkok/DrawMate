import { clearCanvas } from "@/components/clearCanvas";
import { getExistingContent } from "@/components/getContent";
import { Tool } from "@/components/MainCanvas";


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

export class Game {
    private canvas : HTMLCanvasElement ;
    private ctx : CanvasRenderingContext2D ;
    private existingShapes: Shape[]
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "circle";

    socket : WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    async init(){
        this.existingShapes = await getExistingContent(this.roomId);
        clearCanvas(this.canvas,this.ctx,this.existingShapes);
    }

    initHandlers(){
        this.socket.onmessage = (event)=>{
            const msg = JSON.parse(event.data);
            if(msg.type === "chat"){
                const parsedmsg = JSON.parse(msg.message);
                this.existingShapes.push(parsedmsg.shape);
                clearCanvas(this.canvas,this.ctx,this.existingShapes);
            }
        }
    }

    mouseDownHandler = (e) => {
        this.clicked = true
        this.startX = e.clientX
        this.startY = e.clientY
    }

    mouseMoveHandler = (e)=>{
        if(this.clicked){
            const width = e.clientX - this.startX ;
            const height = e.clientY - this.startY;

            clearCanvas(this.canvas,this.ctx,this.existingShapes);
            this.ctx.strokeStyle = "rgba(255,255,255)"

            if(this.selectedTool === "rect"){
                this.ctx.strokeRect(this.startX,this.startY,width,height)
            }
            else if(this.selectedTool == "circle"){
                const radius = Math.max(width,height)/2 ;
                const centerX = this.startX + radius ;
                const centerY = this.startY + radius ; 
                this.ctx.beginPath();
                this.ctx.arc(centerX,centerY,Math.abs(radius),0,Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }
    }
    mouseUpHandler = (e)=>{
        this.clicked = false ;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        const selectedTool = this.selectedTool;

        let shape: Shape | null = null;

        if (selectedTool === "rect") {

            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                height,
                width
            }
        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
            }
        }

        if (!shape) {
            return;
        }
        // this.ctx.strokeStyle = "rgba(255,255,255)"
        // this.ctx.strokeRect(this.startX,this.startY,width,height)

        this.existingShapes.push(shape);
        clearCanvas(this.canvas, this.ctx, this.existingShapes);

        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId: this.roomId
        }))
    }

    initMouseHandlers(){
        this.canvas.addEventListener('mousedown',this.mouseDownHandler);
        this.canvas.addEventListener('mousemove',this.mouseMoveHandler);
        this.canvas.addEventListener('mouseup',this.mouseUpHandler);
    }

    setTool(tool: "circle" | "pencil" | "rect") {
        this.selectedTool = tool;
    }
}