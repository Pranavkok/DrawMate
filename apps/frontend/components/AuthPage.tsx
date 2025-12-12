"use client"

export function AuthPage({isSignIN}:{
    isSignIN : boolean
}){
    return (
        <div>
            <div>
                <input name="email" type="email" placeholder="Enter ur email" />
                <input type="password" placeholder="Enter ur password" />
                <button onClick={()=>{}}>{isSignIN ? "Sign in" : "Sign up"}</button>
            </div>
        </div>
    )
}