// app/login/page.tsx
"use client";

import { useState } from "react";
import { loginUser } from "@/lib/auth";
import { redirect, useRouter } from "next/navigation";
import s from "../style.module.scss";
import { StatusCodes } from "@/lib/StatusCodes";
import { useQueryClient } from "@tanstack/react-query";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const queryClient = useQueryClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);

    if (!email || !password) {
      setError("Email and password are both required");
      setPending(false);
      return;
    }

    const res = await loginUser(email, password);
    setPending(false);
    if (res.status === StatusCodes.Ok) {
      queryClient.invalidateQueries({ queryKey: ["getUser"], exact: true });
      router.push("/");
    }
  };

  return (
    <div className={s.AuthWrapper}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">
          Your email address:
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </label>
        <label htmlFor="password">
          Your password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
