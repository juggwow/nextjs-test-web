import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("")

  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      setName(session.data.user.name);
      setRole(session.data.user.role);
    }
    return () => {};
  }, [session]);

  return (
    <nav className="bg-black text-white p-4 flex flex-row gap-5 fixed right-0 left-0">
      <div>
        <Link href="/">Home</Link>
      </div>
      {session.status === "authenticated" ? (
        <div>
          <Link href="/auth/profile">Profile</Link>
        </div>
      ) : null}
      {role === "TRAINER" ? (
        <div>
          <Link href="/course/manage">Manage</Link>
        </div>
      ) : null}

      {session.status !== "authenticated" ? (
        <div
          style={{ position: "absolute", right: "5%" }}
          className="flex flex-row gap-5"
        >
          <Link href="/auth/login">Sign In</Link>
        </div>
      ) : (
        <div
          style={{ position: "absolute", right: "5%" }}
          className="flex flex-row gap-5"
        >
          <div>{name}</div>
          <button onClick={signOut}>Sign Out</button>
        </div>
      )}
    </nav>
  );
}
