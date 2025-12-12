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
                message : "Incorrect Inputs"
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
            success : "true" ,
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
            message : "Incorrect Inputs"
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
        success : "true" ,
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
                message : "Incorrect Inputs"
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


app.listen(3001);