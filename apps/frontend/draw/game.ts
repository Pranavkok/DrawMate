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
} | {
    type: "text";
    x: number;
    y: number;
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
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
    private activeInput: HTMLTextAreaElement | null = null;
    private activeInputCoords: { x: number, y: number } | null = null;

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
        if (this.activeInput) {
            document.body.removeChild(this.activeInput);
            this.activeInput = null;
            this.activeInputCoords = null; // Also clear coords on destroy
        }
    }

    private _finalizeActiveInput = () => {
        if (!this.activeInput || !this.activeInputCoords) return;

        const text = this.activeInput.value.trim();
        if (text) {
            const shape: Shape = {
                type: "text",
                x: this.activeInputCoords.x,
                y: this.activeInputCoords.y,
                text: text,
                fontSize: 16,
                fontFamily: "Arial",
                color: "red",
            };
            this.existingShapes.push(shape);
            clearCanvas(this.canvas, this.ctx, this.existingShapes);

            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({
                    shape
                }),
                roomId: this.roomId
            }));
        }
        document.body.removeChild(this.activeInput);
        this.activeInput = null;
        this.activeInputCoords = null;
    };

    private documentClickHandler = (e: MouseEvent) => {
        if (this.activeInput && e.target !== this.activeInput && e.target !== this.canvas) {
            this._finalizeActiveInput();
        }
    };

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

    getCanvasCoords(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
    }

    mouseDownHandler = (e : MouseEvent) => {
        // If there's an active text input and the selected tool is not text, finalize it.
        // Or if the selected tool is text, and we click somewhere else to create a new one,
        // finalize the old one first.
        if (this.activeInput && (this.selectedTool !== "text" || !e.target || (e.target !== this.activeInput && e.target !== this.canvas))) {
            this._finalizeActiveInput();
        }

        this.clicked = true
        this.startX = e.clientX
        this.startY = e.clientY

        if(this.selectedTool == "text"){
            const { x, y } = this.getCanvasCoords(e);

            // If there's an existing active input, finalize it before creating a new one.
            // This is already handled by the check at the beginning of the function,
            // but keeping this explicit check here for clarity in this specific branch.
            if (this.activeInput) {
                this._finalizeActiveInput();
            }

            const input = document.createElement("textarea");
            input.style.position = "absolute";
            input.style.left = `${x}px`;
            input.style.top = `${y}px`;
            input.style.border = "1px solid #888";
            input.style.background = "yellow";
            input.style.color = "red";
            input.style.fontSize = "16px";
            input.style.fontFamily = "Arial";
            input.style.outline = "none";
            input.style.resize = "none";
            input.style.cursor = "none";
            input.style.width = "150px";
            input.style.height = "50px";

            document.body.appendChild(input);
            this.activeInput = input;
            this.activeInputCoords = { x, y };
            input.focus();

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent document click handler from firing
                    this._finalizeActiveInput();
                }
            });

            // Prevent clicks on the textarea from propagating to the document click handler
            input.addEventListener("mousedown", (e) => {
                e.stopPropagation();
            });
        }
    }

    mouseMoveHandler = (e)=>{
        if(this.selectedTool === "text"){
            return ;
        }
        if(this.clicked){
            const width = e.clientX - this.startX ;
            const height = e.clientY - this.startY;

            clearCanvas(this.canvas,this.ctx,this.existingShapes);
            this.ctx.strokeStyle = "rgba(255,255,255)"

            if(this.selectedTool === "rect"){
                this.ctx.strokeRect(this.startX,this.startY,width,height)
            }
            else if(this.selectedTool === "circle"){
                const radius = Math.max(width,height)/2 ;
                const centerX = this.startX + radius ;
                const centerY = this.startY + radius ; 
                this.ctx.beginPath();
                this.ctx.arc(centerX,centerY,Math.abs(radius),0,Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            else if(this.selectedTool === "pencil"){
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX,this.startY);
                this.ctx.lineTo(e.clientX,e.clientY)
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }
    }
    mouseUpHandler = (e)=>{
        if(this.selectedTool === "text"){
            return ;
        }
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
        else if(selectedTool === "pencil"){
            shape = {
                type: "pencil",
                startX: this.startX,
                startY: this.startY,
                endX: e.clientX,
                endY: e.clientY,
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
        document.addEventListener("mousedown", this.documentClickHandler);
    }

    setTool(tool: "circle" | "pencil" | "rect" | "text" | "home") {
        if (this.activeInput && this.selectedTool === "text" && tool !== "text") {
            this._finalizeActiveInput();
        }
        this.selectedTool = tool;
    }

}