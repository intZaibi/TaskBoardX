'use client'
import { useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from 'next/navigation';
import { Context } from "../context/context";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const {setUser} = useContext(Context);

  const redirect = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setLoading(true);

  try {
    const email = event.currentTarget.email.value.trim();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const errorMessage = data?.error || "Login failed!";
      throw new Error(errorMessage);
    }

    toast.success("Login successful!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    res.json().then((data) => {
      const user = data.user;
      if (!user || !user.userId) {
        throw new Error("Invalid user data received");
      }
      console.log(user)
      setUser(user);
    }).catch(() => {
      console.log("Error parsing user data from response");
      throw new Error("user data not found in response");
    });

    redirect.push('/');

  } catch (error: any) {
    console.log("Login error:", error);
    toast.error(error.message || "Login failed!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <ToastContainer/>
      <h1 className="text-2xl font-bold mb-4 text-[#0d141c]">Login Page</h1>
      <p className="text-gray-700">This is the login page.</p>
      <form onSubmit={handleLogin} className="mt-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your email"
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className={`w-full ${loading ? "cursor-not-allowed" : ""} cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200`}
        >
          Login
        </button>
      </form>
    </div>
  )
}