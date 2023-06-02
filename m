// import { withAuth } from "next-auth/middleware"

// // More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
// export default withAuth({
//   callbacks: {
//     authorized({ req, token }) {
//       console.log(req)
//       console.log(token)
//       // `/admin` requires admin role
//       if (req.nextUrl.pathname === "/about") {
//         return token?.userRole === "admin"
//       }
//       // `/me` only requires the user to be logged in
//       return !!token
//     },
//   },
// })

// export { default } from "next-auth/middleware"

// export const config = {
//     matcher: ['/about','/test','/api/:path*']
//   }

