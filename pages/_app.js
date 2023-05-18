import '@/styles/globals.css'
import Navbar from '@/components/navbar'
import {Sarabun} from 'next/font/google'

const sarabun = Sarabun({
  subsets: ["latin","thai"],
  weight: ["100","200","300","400","500","600","700","800"]
})

export default function App({ Component, pageProps }) {
  return(
    <div className={'h-full ' + sarabun.className}>
      <Navbar />
      <Component {...pageProps} />
    </div>
      
  ) 
}
