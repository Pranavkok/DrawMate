import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import {JWT_SECRET} from "@repo/backend-common/config";
import {CreateUserSchema , SignInSchema , CreateRoomSchema} from "@repo/common/types"

const app = express();

app.post('/signup',(req,res)=>{

    const data = CreateUserSchema.safeParse(req.body);

    if(!data.success){
        return res.json({
            message : "Incorrect Inputs"
        })
    }

    const {email , password} = req.body;
    if(!email && !password){
        return res.json({
            message : "Provide the email and password" ,
            error : "true" ,
            success : "false"
        })
    }
    const token = jwt.sign({ userId: email }, JWT_SECRET)
    
    return res.status(200).json({
        message : "Login Success" ,
        error : "false" ,
        success : "true" ,
        token : token
    })

})

app.post('/signin',(req,res)=>{

    const data = SignInSchema.safeParse(req.body);

    if(!data.success){
        return res.json({
            message : "Incorrect Inputs"
        })
    }

    const {email , password} = req.body;
    if(!email && !password){
        return res.json({
            message : "Provide the email and password" ,
            error : "true" ,
            success : "false"
        })
    }
    const token = jwt.sign({ email: email }, JWT_SECRET)
    
    return res.status(200).json({
        message : "Login Success" ,
        error : "false" ,
        success : "true" ,
        token : token
    })

})

app.post('/create-room',middleware,(req,res)=>{

    const data = CreateRoomSchema.safeParse(req.body);

    if(!data.success){
        return res.json({
            message : "Incorrect Inputs"
        })
    }

    const {roomId} = req.body ;

    // check whether roomId exists 


    return res.json({
        roomId : "123"
    })
})

app.listen(3001);