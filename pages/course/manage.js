import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
//import { getServerSession } from "next-auth";
//import {authOptions} from "../../api/auth/[...nextauth]"

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (session) {
    try {
      const pro_res = await fetch(process.env.NEXT_PUBLIC_HOST+"/profile", {
        method: "GET",
        headers: {
          Authorization: "Baerer " + session.user.token,
        },
      });
      const data = await pro_res.json();
      if (data.role === "TRAINER") {
        const course_res = await fetch(process.env.NEXT_PUBLIC_HOST+"/courses");
        const data_course = await course_res.json()
        return {
          props: {
            course: data_course
          },
        };
      } else {
        return {
          redirect: {
            destination: "/auth/profile",
          },
        };
      }
    } catch (err) {
      return {
        redirect: {
          destination: "/auth/login",
        },
      };
    }
  }
  return {
    redirect: {
      destination: "/auth/login",
    },
  };
}

export default function CourseID({ course }) {
  const session = useSession();
  const router = useRouter();

  const handlerAddEdit = async (coursedetail)=>{
    const req = {
      ...coursedetail,
      token: session.data.user.token
    }
    const res = await fetch("/api/course", {
      method: "POST",
      body: JSON.stringify(req),
    });
    if (res.status === 200) {
      router.reload();
    }
    const data = await res.json();
    window.alert(data.message);
  }

  

  return (
    <div className="min-h-full bg-gray-100 flex flex-col items-center">
      <p className="mt-16 text-4xl">Manage Course</p>
      <div className="flex flex-row flex-wrap">
      {course.map((data) => {
          return (
            <div
              className="m-4 p-4 shadow-lg bg-white rounded-lg relative"
              id={data.id}
              style={{ width: "250px" }}
              key={data.id}
            >
              <h1 className="text-xl">{data.name}</h1>
              <p className="mt-2 mb-16">{data.desc}</p>
              <Modal buttonlabel={"EDIT"} coursedetail = {data} submitfunction={handlerAddEdit} instyle={{position:"absolute",bottom:"2%"}} /> 
            </div>
          );
        })}
        </div>
             <Modal buttonlabel={"ADD"} coursedetail = {{id: 0, name: "", desc: ""}} submitfunction={handlerAddEdit} />
    </div>
  );
}

export function Modal({ buttonlabel, coursedetail, submitfunction, instyle }) {
  const [showModal, setShowModal] = useState(false);
  const [course, setCourse] = useState(coursedetail);

  const handlerSubmit = async (e) => {
    e.preventDefault();
    submitfunction(course);
  };

  return (
    <>
      <button
        className="bg-blue-200 text-black active:bg-blue-500
      font-bold px-4 py-2 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none my-4 "
        style={instyle}
        type="button"
        onClick={() => setShowModal(true)}
      >
        {buttonlabel}
      </button>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font=semibold">{buttonlabel}: {coursedetail.name}</h3>
                </div>
                <div className="relative p-6 flex-auto">
                  <form
                    onSubmit={handlerSubmit}
                    className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 w-full"
                  >
                    <label className="block text-black text-sm font-bold mb-1">
                      Course
                    </label>
                    <input
                      required
                      value={course.name}
                      onChange={(e) =>
                        setCourse({
                          ...course,
                          name: e.target.value,
                        })
                      }
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                    />
                    <label className="block text-black text-sm font-bold mb-1">
                      Descripttion
                    </label>
                    <input
                      required
                      value={course.desc}
                      onChange={(e) =>
                        setCourse({
                          ...course,
                          desc: e.target.value,
                        })
                      }
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                    />
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                        onClick={() => {
                          setCourse(coursedetail);
                          setShowModal(false);
                        }}
                      >
                        Close
                      </button>
                      <button
                        className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

// const handlerEdit = async (id, classdetail) => {
//     const req = {
//       ...classdetail,
//       class_id: parseInt(id),
//       token: session.data.user.token,
//     };
//     const res = await fetch("/api/editclass", {
//       method: "POST",
//       body: JSON.stringify(req),
//     });
//     if (res.status === 200) {
//       router.reload();
//     }
//     const data = await res.json();
//     window.alert(data.message);
//   };

//   const handlerAdd = async (id, classdetail) => {
//     const req = {
//       ...classdetail,
//       course_id: parseInt(id),
//       token: session.data.user.token,
//     };
//     const res = await fetch("/api/addclass", {
//       method: "POST",
//       body: JSON.stringify(req),
//     });
//     if (res.status === 200) {
//       router.reload();
//     }
//     const data = await res.json();
//     window.alert(data.message);
//   };
