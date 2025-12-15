"use client"

import { useEffect,useState } from "react" ;
import MainCanvas from "./MainCanvas";
import { http_server, ws_server } from "@/config";
import GotLoading from "./GotLoad";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RoomCanvas({roomId}: {roomId: string}){

    const [socket,setSocket] = useState<WebSocket | null>(null);
    const router = useRouter();

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token){
            alert("Please Login First ");
            router.push('/signin')
            return;
        }

        const checkRoom = async () => {
            const isroomthere = await isRoomExists(roomId,token);

            if(!isroomthere){
                router.push('/create-room');
                return;
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
        }
        
        checkRoom();
    },[]);

    if (!socket) {
        return <GotLoading/>
    }

    return(
        <MainCanvas roomId={roomId} socket={socket} />
    )
}

async function isRoomExists(roomId : string , token : string|null){

    if(token === null){
        return false ;
    }

    try {
        const res = await axios.get(`${http_server}/room-exists/${roomId}`,{
            headers : {
                Authorization : token
            }
        })
    
        if(res.data.success){
            if(!res.data.isExists){
                return false ;
            }
            else{
                return true ;
            }
        }
    } catch (error) {
        console.log(error);
        return false ;
    }
}