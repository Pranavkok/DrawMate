"use client"

import { useEffect, useRef, useState } from "react"
// import { IconButton } from "./IconButton";
import { IconButton } from "./IconButton";
import { Circle, Home, Pencil, Square , Type } from "lucide-react";
import { Game } from "@/draw/game";
import { useRouter } from "next/navigation";

export type Tool = "circle" | "rect" | "pencil" | "home" | "text";

export default function MainCanvas({
    roomId,
    socket
}: {
    roomId: string;
    socket: WebSocket;
}){

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool,setSelectedTool] = useState<Tool>("circle");
    const [game,setGame] = useState<Game>();

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    useEffect(()=>{
        if(canvasRef.current){
            const g = new Game(canvasRef.current,roomId,socket);
            setGame(g);

            return () => {
                g.destroy();
            }
        }

    },[canvasRef])

    return(
        <div style={{
            height: "100vh",
            overflow: "hidden"
        }}>
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}>
            </canvas>
            <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
        </div>
    )
}

function Topbar({
    selectedTool,
    setSelectedTool
  }: {
    selectedTool: Tool;
    setSelectedTool: (s: Tool) => void;
  }) {
    const router = useRouter();
    return (
      <div className="fixed top-6 left-6 z-50">
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-2">
          <div className="flex gap-2 ">
            <IconButton
              onClick={() => setSelectedTool("pencil")}
              activated={selectedTool === "pencil"}
              icon={<Pencil className="w-5 h-5" />}
              label="Pencil (P)"
            />
            <IconButton
              onClick={() => setSelectedTool("rect")}
              activated={selectedTool === "rect"}
              icon={<Square className="w-5 h-5" />}
              label="Rectangle (R)"
            />
            <IconButton
              onClick={() => setSelectedTool("circle")}
              activated={selectedTool === "circle"}
              icon={<Circle className="w-5 h-5" />}
              label="Circle (C)"
            />

            <IconButton
              onClick={() => setSelectedTool("text")}
              activated={selectedTool === "text"}
              icon={<Type className="w-5 h-5" />}
              label="Text (T)"
            />
            
            {/* Divider */}
            <div className="w-px bg-gray-200 mx-1" />
            <IconButton
              onClick={() => {router.push('/dashboard')}}
              activated={selectedTool === "home"}
              icon={<Home className="w-5 h-5" />}
              label="Home (H)"
            /> 
            
          </div>
        </div>
      </div>
    );
  }