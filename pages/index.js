
import { useEffect, useState, useRef } from 'react'
import {signIn, useSession} from "next-auth/react"

// export async function getServerSideProps(){
//   const res = await fetch('https://api.zenon.si/post')
//   const data = await res.json()
//   return{
//     props: {
//       tweets: data,
//     }
//   }
// }

export async function getStaticProps(){
  console.log('client run')
  const res = await fetch('https://api.zenon.si/post')
  const data = await res.json()
  return{
    props: {
      tweets: data,
    },
    revalidate: 10
  }
}

export default function IndexPage(props) {
  const [inputValue, setInputValue] = useState('')
  const [list, setList] = useState(props.tweets)
  const [name, setName] = useState('')
  
  const page = useRef(0)
  const session = useSession()

  //console.log(session)
  //const isClient = typeof window !== 'undefined'

  const loadList = (isRefresh = false) => {
    if(isRefresh)
    {
      page.current = 0
    }
    else
    {
      page.current = page.current+1
    }
    
    fetch('https://api.zenon.si/post?page='+page.current)
      .then(response => response.json())
      .then(data => {
        if(isRefresh)
        {
          setList(data)
        }
        else
        {
          setList([...list,...data])
        }
      })
  }

  const tweet = () => {
    
    if(inputValue !== '' && name !== ''){
      setInputValue('')
      fetch('https://nextjs-test-web.vercel.app/api/test', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, content: inputValue, }),
      })
        .then(() => loadList(true))
    }
   
  }

  const signInwithGoogle = () =>{
    signIn('google')
  }

  useEffect(()=>{

    const handler = () => {
        if(Math.round(window.scrollY+window.innerHeight)==document.body.offsetHeight)
        {
          loadList()
        }
    }
    // setScrollY(window.scrollY)
    window.addEventListener('scroll',handler)

    return()=>{
      window.removeEventListener('scroll',handler)
    }
  },[])

  useEffect(()=>{ 
    if(session.status === "authenticated"){
      setName(session.data.user.name)
    }
    console.log(session)
    
    return()=>{}
  },[session])

  return (
    <div className="min-h-full bg-gray-100 flex flex-col items-center">
      
      <form className="w-1/2 flex flex-col" onSubmit={(e)=>{
          e.preventDefault() 
          tweet()}}>
        <div className="w-full mt-32 bg-white p-6 rounded-lg shadow">
            <input
              type='text'
              required
              className="outline-none w-full resize-none bg-gray-50 p-2 rounded-lg"
              placeholder='Pls, Sign In'
              disabled
              value={name}
            />
            <textarea
              rows={8}
              className="outline-none w-full resize-none mt-4 bg-gray-50 rounded-lg"
              value={inputValue}
              onChange={(event) => {
                const value = event.target.value
                setInputValue(value)
              }}
            />
            <div className='flex-row ml-auto'>
          <button
            className="mt-6 bg-gray-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
            type="submit"
          >
            Tweet
          </button>
          <button
            className="mt-6 ml-4 bg-gray-400 text-white py-2 px-4 rounded-lg"
            type='button'
            onClick={()=>loadList(true)}
          >
            Refresh
          </button>

        </div>
          
            
        </div>
        
        
      </form>
      <div className="flex-row" >
        <button className='bg-white p-4 mt-8 mx-4 rounded-lg shadow-lg ' onClick={signIn}> 
          Login
        </button>
        <button className='bg-white p-4 mt-8 rounded-lg shadow-lg ' onClick={signInwithGoogle}> 
          Sign In with Google
        </button>
      </div>
      <div className="w-1/2 mt-8">
        { list.map((data) => {
          return (
            <div key={data.id} className="mt-4 bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-xl font-bold">{data.name}</h1>
              <div className="mt-2 text-gray-600">
                {data.content}
              </div>
            </div>
          )
        }) }
      </div>
    </div>
  )
}