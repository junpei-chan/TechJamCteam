"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authLogin } from "@/api/authLogin"
import Cookies from "js-cookie";

export default function Login() {
  const [errors, setErrors] = useState<string[]>([]);
  const [formValues, setFormValues] = useState({
    email: "",
    password: ""
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    const response = await authLogin({
      request: {
        email: formValues.email,
        password: formValues.password
      }
    });
    if (response.success && "access_token" in response && response.access_token) {
      Cookies.set("authToken", String(response.access_token), { expires: 7 });
      router.push("/");
    } else {
      setErrors(
        typeof response.messages === "string"
          ? [response.messages]
          : Array.isArray(response.messages)
            ? response.messages
            : []
      );
    }
  };

  return (
    <main>
      <h1>Login Page</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input 
            type="text" 
            id="email"
            className="border"
            autoComplete="off"
            name="email"
            value={formValues.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input 
            type="password" 
            id="password"
            className="border"
            autoComplete="off"
            name="password"
            value={formValues.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">ログイン</button>
      </form>

      <div>
        {errors.length > 0 && (
          <ul>
            {errors.map((error, index) => (
              <li key={index}>
                {error}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}