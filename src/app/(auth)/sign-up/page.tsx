// app/register/page.tsx
"use client";

import { useState } from "react";
import { registerUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { StatusCodes } from "@/lib/StatusCodes";
import s from "../style.module.scss";
import { Button } from "@/components";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const validateFields = () => {
    if (!email || !password || !name) {
      setError("All fields are required");
      return false;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateFields()) {
      return;
    }
    setPending(true);

    const regQuery = await registerUser({
      email,
      password,
      name,
    });
    setPending(false);

    if (regQuery.status === StatusCodes.Ok) {
      return router.push("/");
    }

    if (regQuery.status === StatusCodes.Conflict) {
      setError("User with this email already exists");
    }

    if (regQuery.status === StatusCodes.InternalServerError) {
      setError("Internal server error");
    }
  };

  return (
    <div className={s.AuthWrapper}>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <label htmlFor="name">
          Enter username:
          <input
            disabled={pending}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Username"
          />
        </label>
        <label htmlFor="email">
          Enter email:
          <input
            disabled={pending}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </label>
        <label htmlFor="password">
          Enter password:
          <input
            disabled={pending}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </label>
        <Button type="submit" disabled={pending}>
          Register
        </Button>
        {error && <small className={s.errorText}>{error}</small>}
      </form>
    </div>
  );
}
