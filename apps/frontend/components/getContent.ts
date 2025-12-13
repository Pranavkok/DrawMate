import { http_server } from "@/config";
import axios from "axios";

export async function getExistingContent(roomId : string){
    const res = await axios.get(`${http_server}/chats/${roomId}`);
    const messages = res.data.messages ;

    const shapes = messages.map((s : {message: string})=> {
        const parsedData = JSON.parse(s.message);
        return parsedData.shape;
    })

    return shapes ; 
}