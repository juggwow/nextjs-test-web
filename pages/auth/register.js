import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    cpassword: "",
  });

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.cpassword) {
      window.alert("Password is not correct");
      return;
    }
    const req = { username: user.username, password: user.password };
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(req),
    });
    if (res.status === 200) {
      window.alert("Success. Pls, log in")
      router.push("/auth/login");
    }
    const data = await res.json();
    window.alert(data.message);
  };

  return (
    <div className="min-h-full bg-gray-100 flex justify-center items-center">
      <div className="flex-col w-5/6 mt-32">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-xl text-black p-4 "
        >
          <div className="mb-4">
            <div>Username</div>
            <div>
              <input
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="bg-gray-300 border border-gray-500 w-full p-2 rounded-lg mt-2"
              />
            </div>
          </div>
          <div>
            <div>Password</div>
            <div>
              <input
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                type="password"
                className="bg-gray-300 border border-gray-500 w-full p-2 rounded-lg mt-2"
              />
            </div>
            <div>Confirm Password</div>
            <div>
              <input
                value={user.cpassword}
                onChange={(e) =>
                  setUser({ ...user, cpassword: e.target.value })
                }
                type="password"
                className="bg-gray-300 border border-gray-500 w-full p-2 rounded-lg mt-2"
              />
            </div>
          </div>
          <div className="mt-8 flex flex-row gap-4 w-1/2">
            <button
              type="submit"
              className="bg-gray-800 text-white font-bold p-4 rounded-lg shadow-lg"
            >
              Confirm
            </button>
            <div className="bg-cyan-800 text-white font-bold p-4 rounded-lg shadow-lg">
              <Link href="/auth/login">Back</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
