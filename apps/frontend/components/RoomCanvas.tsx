"use client"

import { useEffect,useState } from "react" ;
import MainCanvas from "./MainCanvas";
import { ws_server } from "@/config";
import SomethingWentWrong from "./GotError";
import { useRouter } from "next/navigation";

export default function RoomCanvas({roomId}: {roomId: string}){

    const [socket,setSocket] = useState<WebSocket | null>(null);
    const router = useRouter();

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token){
            alert("Please Login First ");
            router.push('/signin')
        }
        const ws = new WebSocket(`${ws_server}?token=${token}`);
        
        ws.onopen = ()=>{
            setSocket(ws);

            const data = {
                type : "join_room" ,
                roomId : roomId 
            }

            ws.send(JSON.stringify(data))
        }
    },[roomId]);

    if (!socket) {
        return <SomethingWentWrong/>
    }

    return(
        <MainCanvas roomId={roomId} socket={socket} />
    )
}