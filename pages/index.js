import { useEffect, useState, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export async function getStaticProps() {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_HOST+"/courses");
    const data = await res.json();
    return {
      props: {
        courses: data,
      },
      revalidate: 10,
    };
  } catch (err) {
    return {
      props: {
        courses: [],
      },
      revalidate: 10,
    };
  }
}

export default function IndexPage({ courses }) {
  console.log(courses);
  const router = useRouter();

  return (
    <div className="min-h-full bg-gray-100 flex flex-col items-center">
      <p className="mt-16 text-4xl">All Courses</p>
      <div className="mt-4 flex flex-row flex-wrap w-5/6 ">
        {courses.map((data) => {
          return (
            <div
              className="m-4 p-4 shadow-lg bg-white rounded-lg relative"
              id={data.id}
              style={{ width: "250px" }}
              key={data.id}
            >
              <h1 className="text-xl">{data.name}</h1>
              <p className="mt-2 mb-16">{data.desc}</p>
              <button
                id={data.id}
                className="mt-6 bg-gray-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg absolute bottom-2"
                onClick={(e) => {
                  router.push("/course/" + data.name + "/" + e.target.id);
                }}
              >
                See all classes
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
////////////Example Code in class/////////////

// export async function getServerSideProps(){
//   const res = await fetch('https://api.zenon.si/post')
//   const data = await res.json()
//   return{
//     props: {
//       tweets: data,
//     }
//   }
// }
// export async function getServerSideProps({ req, res, resolvedUrl }) {
//   console.log(resolvedUrl)

//  // Remaining code
// }

// export async function getStaticProps() {
//   console.log("client run");
//   const res = await fetch("https://api.zenon.si/post");
//   const data = await res.json();
//   return {
//     props: {
//       tweets: data,
//     },
//     revalidate: 10,
//   };
// }

// export default function IndexPage(props) {
//   const [inputValue, setInputValue] = useState("");
//   const [list, setList] = useState(props.tweets);
//   const [name, setName] = useState("");

//   const page = useRef(0);
//   const session = useSession();

//   //console.log(session)
//   //const isClient = typeof window !== 'undefined'

//   const loadList = (isRefresh = false) => {
//     if (isRefresh) {
//       page.current = 0;
//     } else {
//       page.current = page.current + 1;
//     }

//     fetch("https://api.zenon.si/post?page=" + page.current)
//       .then((response) => response.json())
//       .then((data) => {
//         if (isRefresh) {
//           setList(data);
//         } else {
//           setList([...list, ...data]);
//         }
//       });
//   };

//   const tweet = () => {
//     if (inputValue !== "" && name !== "") {
//       setInputValue("");
//       fetch("/api/test", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name, content: inputValue }),
//       }).then(() => loadList(true));
//     }
//   };

//   const signInwithGoogle = () => {
//     signIn("google");
//   };

//   useEffect(() => {
//     const handler = () => {
//       if (
//         Math.round(window.scrollY + window.innerHeight) ==
//         document.body.offsetHeight
//       ) {
//         loadList();
//       }
//     };
//     // setScrollY(window.scrollY)
//     window.addEventListener("scroll", handler);

//     return () => {
//       window.removeEventListener("scroll", handler);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (session.status === "authenticated") {
//       setName(session.data.user.name);
//     }

//     return () => {};
//   }, [session]);

//   return (
//     <div className="min-h-full bg-gray-100 flex flex-col items-center">
//       <form
//         className="w-1/2 flex flex-col"
//         onSubmit={(e) => {
//           e.preventDefault();
//           tweet();
//         }}
//       >
//         <div className="w-full mt-32 bg-white p-6 rounded-lg shadow">
//           <input
//             type="text"
//             required
//             className="outline-none w-full resize-none bg-gray-50 p-2 rounded-lg"
//             placeholder="Pls, Sign In"
//             disabled
//             value={name}
//           />
//           <textarea
//             rows={8}
//             className="outline-none w-full resize-none mt-4 bg-gray-50 rounded-lg"
//             value={inputValue}
//             onChange={(event) => {
//               const value = event.target.value;
//               setInputValue(value);
//             }}
//           />
//           <div className="flex-row ml-auto">
//             <button
//               className="mt-6 bg-gray-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
//               type="submit"
//             >
//               Tweet
//             </button>
//             <button
//               className="mt-6 ml-4 bg-gray-400 text-white py-2 px-4 rounded-lg"
//               type="button"
//               onClick={() => loadList(true)}
//             >
//               Refresh
//             </button>
//           </div>
//         </div>
//       </form>

//       <div className="w-1/2 mt-8">
//         {list.map((data) => {
//           return (
//             <div
//               key={data.id}
//               className="mt-4 bg-white rounded-lg shadow-lg p-6"
//             >
//               <h1 className="text-xl font-bold">{data.name}</h1>
//               <div className="mt-2 text-gray-600">{data.content}</div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

/////////////End Code//////////////////
