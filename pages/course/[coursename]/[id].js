import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
//import { getServerSession } from "next-auth";
//import {authOptions} from "../../api/auth/[...nextauth]"

export async function getServerSideProps(ctx) {
  const res = await fetch(process.env.NEXT_PUBLIC_HOST+"/classes/" + ctx.query.id);
  const classes = await res.json();
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
      if (data.role !== "") {
        return {
          props: {
            classes,
            role: data.role,
            course: {
              id: ctx.query.id,
              name: ctx.query.coursename,
            },
            username: session.user.name,
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

export default function CourseID({ classes, role, course, username }) {
  const session = useSession();
  const router = useRouter();

  //const role = session.data.user.role

  const handlerEnroll = async (id) => {
    const res = await fetch("/api/enroll", {
      method: "POST",
      body: JSON.stringify({
        classId: id,
        token: session.data.user.token,
      }),
    });
    if (res.status === 200) {
      router.reload();
    }
    const data = await res.json();
    window.alert(data.message);
  };

  const handlerDelete = async (id) => {
    console.log("Delete: " + id);
    const res = await fetch("/api/deleteclass", {
      method: "POST",
      body: JSON.stringify({
        id,
        token: session.data.user.token,
      }),
    });
    if (res.status === 200) {
      router.reload();
    }
    const data = await res.json();
    window.alert(data.message);
  };

  const handlerEdit = async (id, classdetail) => {
    const req = {
      ...classdetail,
      class_id: parseInt(id),
      token: session.data.user.token,
    };
    const res = await fetch("/api/editclass", {
      method: "POST",
      body: JSON.stringify(req),
    });
    if (res.status === 200) {
      router.reload();
    }
    const data = await res.json();
    window.alert(data.message);
  };

  const handlerAdd = async (id, classdetail) => {
    const req = {
      ...classdetail,
      course_id: parseInt(id),
      token: session.data.user.token,
    };
    const res = await fetch("/api/addclass", {
      method: "POST",
      body: JSON.stringify(req),
    });
    if (res.status === 200) {
      router.reload();
    }
    const data = await res.json();
    window.alert(data.message);
  };

  return (
    <div className="min-h-full bg-gray-100 flex flex-col items-center">
      <p className="mt-16 text-4xl">{router.query.coursename}</p>
      {classes.map((data) => {
        return (
          <div
            key={data.ID}
            className="mt-4 bg-white rounded-lg shadow-lg p-6 w-5/6"
          >
            <h1 className="text-xl font-bold">{data.Course.name}</h1>
            <h1 className="text-lg">{data.Course.desc}</h1>
            <p className="mt-4">
              Time: {data.Start} to {data.End}
            </p>
            <p>Trainer: {data.Trainer.Name}</p>
            <p>
              Available Seat: {data.Students.length}/{data.Seats}
            </p>
            {role !== "TRAINER" ? (
              <StudentButton handlerEnroll={handlerEnroll} classId={data.ID} />
            ) : data.Trainer.Name === username ? (
              <TrainerButton
                handlerDelete={handlerDelete}
                handlerEdit={handlerEdit}
                classId={data.ID}
                coursename={
                  "date: " +
                  data.Start +
                  " to " +
                  data.End +
                  ", Seats: " +
                  data.Seats
                }
              />
            ) : null}
          </div>
        );
      })}
      {role === "TRAINER" ? (
        <Modal
          buttonlabel={"ADD"}
          texttitle={"Add: " + course.name}
          id={course.id}
          submitfunction={handlerAdd}
        />
      ) : null}
    </div>
  );
}

export function StudentButton({ handlerEnroll, classId }) {
  return (
    <button
      id={classId}
      onClick={(e) => handlerEnroll(e.target.id)}
      className="mt-6 bg-gray-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
    >
      Enroll
    </button>
  );
}

export function TrainerButton({
  handlerDelete,
  handlerEdit,
  classId,
  coursename,
}) {
  return (
    <div className="flex-row ml-auto">
      <Modal
        buttonlabel={"EDIT"}
        texttitle={"EDIT: " + coursename}
        id={classId}
        submitfunction={handlerEdit}
      />
      <button
        id={classId}
        className="mt-6 ml-4 bg-gray-400 text-white py-2 px-4 rounded-lg"
        onClick={(e) => handlerDelete(e.target.id)}
      >
        Delete
      </button>
    </div>
  );
}

export function Modal({ buttonlabel, texttitle, submitfunction, id }) {
  const [showModal, setShowModal] = useState(false);
  const [classdetail, setClassdetail] = useState({});

  const handlerSubmit = async (e) => {
    e.preventDefault();
    submitfunction(id, classdetail);
  };

  return (
    <>
      <button
        className="bg-blue-200 text-black active:bg-blue-500 
      font-bold px-4 py-2 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none my-4 "
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
                  <h3 className="text-3xl font=semibold">{texttitle}</h3>
                </div>
                <div className="relative p-6 flex-auto">
                  <form
                    onSubmit={handlerSubmit}
                    className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 w-full"
                  >
                    <label className="block text-black text-sm font-bold mb-1">
                      Start Date
                    </label>
                    <input
                      required
                      onChange={(e) =>
                        setClassdetail({
                          ...classdetail,
                          start: e.target.value,
                        })
                      }
                      type="datetime-local"
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                    />
                    <label className="block text-black text-sm font-bold mb-1">
                      End Date
                    </label>
                    <input
                      required
                      onChange={(e) =>
                        setClassdetail({
                          ...classdetail,
                          end: e.target.value,
                        })
                      }
                      type="datetime-local"
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                    />
                    <label className="block text-black text-sm font-bold mb-1">
                      Seat No.
                    </label>
                    <input
                      required
                      value={classdetail.seats}
                      onChange={(e) =>
                        setClassdetail({
                          ...classdetail,
                          seats: parseInt(e.target.value),
                        })
                      }
                      type="number"
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                    />
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                        onClick={() => {
                          setClassdetail({});
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
