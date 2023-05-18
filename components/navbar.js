import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Navbar(){

    const router = useRouter()
    const hello = ()=>{
        //alert('good evening')
        const action = confirm('ไปต่อหรือไม่')
        if (action){
            router.push('/login')
        }
        // else{
        //     router.back()
        // }
        
    }

    return (
        <nav className="bg-black text-white p-4 flex flex-row gap-5 fixed right-0 left-0">
            <div>
            <Link href="/">Home</Link>
            </div>
            <div>
            <Link href="/login">Login</Link>
            </div>
            <div>
                <button onClick={hello}>อะไร</button>
            </div>
        </nav>
    )
}