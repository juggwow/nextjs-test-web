import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

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

      return {
        props: {
          data,
        },
      };
    } catch (err) {
      return {
        redirect: {
          destination: "/auth/login",
        },
      };
    }
  } else {
    return {
      redirect: {
        destination: "/auth/login",
      },
    };
    return;
  }
}

export default function ProfilePage({ data }) {
  const [profile, setProfile] = useState(data);

  if (profile.role === "") {
    setProfile({ ...profile, role: "STUDENT" });
  }

  const session = useSession();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const req = { ...profile, token: session.data.user.token };
    const res = await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify(req),
    });
    if (res.status === 200) {
      router.push("/auth/login");
    }
    const data = await res.json();
    window.alert(data.message);
  };

  return (
    <div>
      <div className="min-h-full bg-gray-100 flex justify-center items-center">
        <div className="flex-col w-5/6 my-32">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-2xl rounded-xl text-black p-4 "
          >
            <div className="mb-4">
              <div>Firstname</div>
              <div>
                <input
                  required
                  value={profile.fname}
                  onChange={(e) =>
                    setProfile({ ...profile, fname: e.target.value })
                  }
                  className="bg-gray-300 border border-gray-500 w-full p-2 rounded-lg mt-2"
                />
              </div>
            </div>
            <div>
              <div>Lastname</div>
              <div>
                <input
                  required
                  value={profile.lname}
                  onChange={(e) =>
                    setProfile({ ...profile, lname: e.target.value })
                  }
                  type="text"
                  className="bg-gray-300 border border-gray-500 w-full p-2 rounded-lg mt-2"
                />
              </div>
              <div>Company</div>
              <div>
                <input
                  required
                  value={profile.company}
                  onChange={(e) =>
                    setProfile({ ...profile, company: e.target.value })
                  }
                  type="text"
                  className="bg-gray-300 border border-gray-500 w-full p-2 rounded-lg mt-2"
                />
              </div>
              <div>Mobile No.</div>
              <div>
                <input
                  required
                  value={profile.mobile}
                  onChange={(e) =>
                    setProfile({ ...profile, mobile: e.target.value })
                  }
                  type="text"
                  className="bg-gray-300 border border-gray-500 w-full p-2 rounded-lg mt-2"
                />
              </div>
              <label for="role">Role: </label>
              <select
                className="p-2 m-2"
                name="role"
                id="role"
                onChange={(e) =>
                  setProfile({ ...profile, role: e.target.value })
                }
              >
                <option value="STUDENT" selected>
                  Student
                </option>
                <option value="TRAINER" selected={profile.role === "TRAINER"}>
                  Trainer
                </option>
              </select>
            </div>
            <div className="mt-8 flex flex-row gap-4 w-1/2">
              <button
                type="submit"
                className="bg-gray-800 text-white font-bold p-4 rounded-lg shadow-lg"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
