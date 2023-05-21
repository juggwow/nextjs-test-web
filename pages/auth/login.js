import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {
    const [user,setUser] = useState({username:"",password:""})
    const handleSubmit = async (e)=>{
        e.preventDefault()
        const res = await signIn('credentials',{
            username: user.username,
            password: user.password,
        })
        console.log(res)

    }
    return (
        <div className="min-h-full bg-gray-100 flex justify-center items-center">
            <form onSubmit={handleSubmit} className="mt-32 bg-white shadow-2xl rounded-xl text-black p-4 w-1/2">
                <div className="mb-4">
                    <div>Username</div>
                    <div>
                        <input value={user.username} onChange={(e)=>setUser({...user,username:e.target.value})} className="bg-gray-300 border border-gray-500 w-full p-2 rounded-lg mt-2" />
                    </div>
                </div>
                <div>
                    <div>Password</div>
                    <div>
                        <input value={user.password} onChange={(e)=>setUser({...user,password:e.target.value})} type="password" className="bg-gray-300 border border-gray-500 w-full p-2 rounded-lg mt-2" />
                    </div>
                </div>
                <div className="mt-8">
                    <button type="submit" className="bg-gray-800 text-white font-bold w-full py-4 rounded-lg shadow-lg">
                        Login
                    </button>
                </div>
            </form>
        </div>
    )
}