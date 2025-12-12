import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken" ;
// @ts-ignore
import {JWT_SECRET} from "@repo/backend-common/config"
import {prismaClient} from "@repo/db/client"

const wss = new WebSocketServer({port : 8080});

interface userType {
    ws : WebSocket ,
    rooms : string[] ,
    userId : string
}
const Users : userType[] = []

function checkUser(token : string) : string | null{
    try {
        const decoded = jwt.verify(token,JWT_SECRET);

        if(typeof(decoded) == "string"){
            return null ;
        }

        if(!decoded || !decoded.userId){
            return null;
        }

        return decoded.userId
    } catch (error) {
        return null ;
    }
    return null ;
}

wss.on("connection",(ws,req)=>{

    const url = req.url ;
    if(!url){
        return ;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";

        const userAuth = checkUser(token);
        if(userAuth == null){
            ws.close();
            return null;
        }

        Users.push({
            ws : ws ,
            rooms : [],
            userId : userAuth
        })

    ws.on('message',async(data)=>{

        let parsedData : any;

        if(typeof(data) !== "string"){
            parsedData = JSON.parse(data.toString());
        }
        else{
            parsedData = JSON.parse(data);
        }

        if(parsedData.type === "join_room"){
            try {
                const user = Users.find(x => x.ws === ws);
                user?.rooms.push(parsedData.roomId);
            } catch (error) {
                console.log(error);   
            }
        }

        if(parsedData.type === "leave_room"){
            try {
                const user = Users.find(x => x.ws === ws);
                if(!user){
                    return ;
                }
                user.rooms = user?.rooms.filter(x => x !== parsedData.roomId);
            } catch (error) {
                console.log(error);   
            }
        }

        if(parsedData.type === "chat"){
            try {
                const message = parsedData.message ;
                const roomId = parsedData.roomId ;

                const room = await prismaClient.room.findUnique({
                    where: { id: Number(roomId) }
                });

                if (!room) {
                    // Optionally, you could send an error message back to the client
                    console.log(`Room not found: ${roomId}`);
                    return;
                }

            await prismaClient.chat.create({
                data : {
                    roomId : Number(roomId),
                    message : message,
                    userId : userAuth,
                }
            })

            Users.forEach(user => {
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type : "chat" ,
                        message : message ,
                        roomId : roomId
                    }));
                }
            })
            } catch (error) {
                console.log(error);
            }
        }
    });
});