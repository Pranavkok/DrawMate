import 'dotenv/config'; 
import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware.js";
import {JWT_SECRET} from "@repo/backend-common/config";
import {CreateUserSchema , SignInSchema , CreateRoomSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client"
import cors from "cors"

const app = express();

app.use(express.json());
app.use(cors());

app.post('/signup',async(req,res)=>{
    try {
        const PrasedData = CreateUserSchema.safeParse(req.body);

        if(!PrasedData.success){
            return res.json({
                message : "Incorrect Inputs",
                success : false 
            })
        }

        const exists = await prismaClient.user.findUnique({
            where: {
                email: PrasedData.data.email, // 'email' is a unique field
              },
        });
        // @ts-ignore
        if(exists){
            return res.json({
                message : "Already Registered" ,
                success : false
            })
        }

        const user = await prismaClient.user.create({
            // @ts-ignore
            data : {
                email : PrasedData.data?.email , 
                password : PrasedData.data.password ,
                name : PrasedData.data.name
            }
        });



        const token = jwt.sign({ userId: user?.id }, JWT_SECRET)
        
        return res.status(200).json({
            message : "SignUp Success" ,
            error : "false" ,
            success : true ,
            token : token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Server side error" ,
            success : false , 
            error : error
        })
    }
})

app.post('/signin',async(req,res)=>{

    const PrasedData = SignInSchema.safeParse(req.body);

    if(!PrasedData.success){
        return res.json({
            message : "Incorrect Inputs",
            success : false 
        })
    }

    const user = await prismaClient.user.findUnique({where :{email : PrasedData.data.email , password : PrasedData.data.password}});

    if(!user){
        return res.json({
            message : "Dont Found This Email" ,
            success : false
        })
    }

    const token = jwt.sign({ userId: user?.id }, JWT_SECRET)
    
    return res.status(200).json({
        message : "Login Success" ,
        error : "false" ,
        success : true ,
        token : token
    })

})

app.post('/create-room',middleware,async(req,res)=>{
    try {
        const PrasedData = CreateRoomSchema.safeParse(req.body);
        // @ts-ignore
        const userid = req.userId ;

        if(!PrasedData.success){
            return res.json({
                message : "Incorrect Inputs",
                success : false
            })
        }

        // check whether roomId exists 

        const room = await prismaClient.room.create({
            data : {
                slug : PrasedData.data.roomId ,
                adminId : userid
            }
        })


        return res.json({
            message : "Room Created success",
            success : true ,
            roomId : room?.id
        })
    } catch (error) {
        return res.json({
            message : "Room Created Failed",
            success : false
        })
    }
})

app.get('/chats/:roomId',async(req,res)=>{
    try {
        const roomId = Number(req.params.roomId );
        const messages = await prismaClient.chat.findMany({
            where : {
                roomId : roomId
            },
            orderBy : {
                id : "desc"
            },
            take : 1000
        })
        res.json({
            messages
        })
    } catch (error) {
        console.log(error);
        res.json({
            messages: []
        })
    }
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})

app.get("/get-rooms",middleware,async(req,res)=>{
    try {
        // @ts-ignore
        const userid = req.userId ;

        const userRooms = await prismaClient.room.findMany({
            where : {
                adminId : userid
            }
        })

        return res.status(200).json({
            message : "Here are your Rooms",
            success : true ,
            userRooms : userRooms
        })
    } catch (error) {
        return res.json({
            message : "Error occured while getting your rooms",
            success : false
        })
    }
})

app.delete("/delete-room/:roomId",middleware,async(req,res)=>{
    try {
        // @ts-ignore
        const userid = req.userId ;
        const roomId = Number(req.params.roomId);

        await prismaClient.chat.deleteMany({
            where: {
                roomId: roomId
            }
        });

        const deletedRoom = await prismaClient.room.delete({
            where : {
                adminId : userid ,
                id : roomId, 
            }
        })

        if(!deletedRoom){
            return res.status(404).json({ 
                message : "No Room Found" ,
                success : true
            })
        }

        return res.status(200).json({
            message : "Room Deleted success" ,
            success : true
        })
        
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ 
            message: "Failed to delete room due to server error",
            success: false,
            error: error
        });
    }
})

app.get("/join-room/:slug",middleware,async(req,res)=>{
    try {
        const roomslug = req.params.slug ;
        const gotRoom = await prismaClient.room.findFirst({
            where : {
                slug : roomslug
            }
        })

        if(!gotRoom){
            return res.json({
                message : "This room doesnt exists , You can create one ",
                success : true ,
                isExists : false 
            })
        }

        return res.json({
            message : "Welcome to the room",
            success : true ,
            isExists : true  ,
            roomId : gotRoom.id
        })

    } catch (error) {
        return res.status(500).json({
            message : "Server side error occured ",
            success : false 
        })
    }
})

// app.get("/search",middleware ,async(req,res)=>{
//     try {
//         // @ts-ignore
//         const userid = req.userId ;
//         const fetchedRooms = await prismaClient.room.findMany({
//             where : {
//                 adminId : userid,
//             }
//         })

//         return res.status(200).json({
//             message : "search room success" ,
//             success : true ,
//             rooms : fetchedRooms
//         })
//     } catch (error) {
//         return res.status(500).json({
//             message : "Error Occured while searching for room",
//             success : false 
//         })
//     }
// })

app.get("/room-exists/:roomid",async(req,res)=>{
    try {
        // check /canvas/room
        const roomid = req.params.roomid;
        const exist = await prismaClient.room.findFirst({
            where : {
                id : Number(roomid)
            }
        })

        if(!exist){
            return res.json({
                message : "This room doesnt exists , You can create one ",
                success : true ,
                isExists : false 
            })
        }

        return res.json({
            message : "Welcome to the room",
            success : true ,
            isExists : true  
        })
        
    } catch (error) {
        return res.status(500).json({
            message : "Error occured while finding is this room exists ",
             success : false 
        })
    }
})



app.listen(3001);