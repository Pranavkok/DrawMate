"use client"

import { useEffect,useState } from "react" ;
import MainCanvas from "./MainCanvas";
import { ws_server } from "@/config";

export default function RoomCanvas({roomId}: {roomId: string}){

    const [socket,setSocket] = useState<WebSocket | null>(null);

    useEffect(()=>{
        const ws = new WebSocket(`${ws_server}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlM2VlNmZhYy1kM2IzLTQ3YjMtODNiZi03NmRkMDk5MTk2YzkiLCJpYXQiOjE3NjUzNTExOTB9.hFioep67-sjn5fRG57Y0-Vqb-1QeGkaN50uIY4C-vFQ`);
        
        ws.onopen = ()=>{
            setSocket(ws);

            const data = {
                type : "join_room" ,
                roomId : roomId 
            }

            ws.send(JSON.stringify(data))
        }
    },[]);

    if (!socket) {
        return <div>
            Connecting to server....
        </div>
    }

    return(
        <MainCanvas roomId={roomId} socket={socket} />
    )
}