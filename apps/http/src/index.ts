import 'dotenv/config'; 
import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware.js";
import {JWT_SECRET} from "@repo/backend-common/config";
import {CreateUserSchema , SignInSchema , CreateRoomSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client"

const app = express();

app.use(express.json());

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



        const token = jwt.sign({ userId: user }, JWT_SECRET)
        
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

// app.post('/signin',(req,res)=>{

//     const data = SignInSchema.safeParse(req.body);

//     if(!data.success){
//         return res.json({
//             message : "Incorrect Inputs"
//         })
//     }

//     const user = prismaClient.user.findUnique({email : req.body.email});

//     if(!user){
//         return res.json({
//             message : "Dont Found This Email" ,
//             success : false
//         })
//     }

//     const token = jwt.sign({ userId: user }, JWT_SECRET)
    
//     return res.status(200).json({
//         message : "Login Success" ,
//         error : "false" ,
//         success : "true" ,
//         token : token
//     })

// })

// app.post('/create-room',middleware,(req,res)=>{

//     const data = CreateRoomSchema.safeParse(req.body);

//     if(!data.success){
//         return res.json({
//             message : "Incorrect Inputs"
//         })
//     }

//     const {roomId} = req.body ;

//     // check whether roomId exists 


//     return res.json({
//         roomId : "123"
//     })
// })

app.listen(3001);