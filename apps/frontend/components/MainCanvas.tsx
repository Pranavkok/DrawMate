"use client"

import { drawon } from "@/draw";
import { useEffect, useRef } from "react"

export default function MainCanvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}){

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(()=>{
        
        if(canvasRef.current){
            drawon(canvasRef.current,roomId,socket);
        }
    },[canvasRef]);

    return(
        <div>
            <canvas ref={canvasRef} width={1400} height={800}>

            </canvas>
        </div>
    )
}