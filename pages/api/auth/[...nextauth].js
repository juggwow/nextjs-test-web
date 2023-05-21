import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    CredentialsProvider({
        // The name to display on the sign in form (e.g. 'Sign in with...')
        type: 'credentials',
        name: 'Credentials',
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: { label: "Username", type: "text", placeholder: "pong" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          const res = await fetch("http://localhost:8080/login",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password
            }),
          })

          const user = await res.json()

          if(user){
            return {...user,name: credentials.username}
          }

          return null
            
        },
       
      })
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
        
        return {...token,...user}
      },
    async session({ session, user, token }) {
        if(token){
            session.user = token 
        }
        return session
      },
  },
  pages: {
        signIn: '/auth/login'
  },
  secret: process.env.NEXTAUTH_SECRET
}
export default NextAuth(authOptions)