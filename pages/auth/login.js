import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ username: "", password: "" });
  const handleSubmit = async (e) => {
    e.preventDefault();
    signIn("credentials", {
      username: user.username,
      password: user.password,
      redirect: false,
    }).then((r) =>
      r.status === 200
        ? router.push("/")
        : window.alert("Username or Password not correct")
    );
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
          </div>
          <div className="mt-8 flex flex-row gap-4 w-1/2">
            <button
              type="submit"
              className="bg-gray-800 text-white font-bold p-4 rounded-lg shadow-lg"
            >
              Login
            </button>
            <div className="bg-cyan-800 text-white font-bold p-4 rounded-lg shadow-lg">
              <Link href="/auth/register">Registor</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
