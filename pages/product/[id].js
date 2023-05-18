import { useRouter } from "next/router"


export default function ProDe(){
    //React Hooks
    const router = useRouter()
    console.log(router)
    
    return (
        <div>
            fdsaf {router.query.id}
        </div>
    )
}