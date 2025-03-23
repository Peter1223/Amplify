"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");

    try {
      // signup request
      const signupRes = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!signupRes.ok) {
        const errorData = await signupRes.json();
        throw new Error(errorData.error || "Signup failed.");
      }

      // getting user data from db 
      const userRes = await fetch("/api/user/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username }),
      });

      const userData = await userRes.json();
      if (!userRes.ok) throw new Error("Failed to load user data.");

      // again setting global zustand state
      const store = useUserStore.getState();
      store.setUser(userData.username, userData.role);
      store.setLikedSongs(userData.likedSongs);
      store.setPlaylists(userData.playlists);
      store.setStreamingHistory(userData.streamingHistory);

      alert("Signup successful! Welcome to Amplifi <3");

      // redirecting based on role
      if (userData.role === "artist") {
        router.push("/artistprofile");
      } else if (userData.role === "listener") {
        router.push("/home");
      } else if (userData.role === "admin") {
        router.push("/adminprofile");
      } else {
        router.push("/home");
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="neon-card relative flex flex-col items-center justify-center w-full max-w-md p-8 rounded-xl shadow-lg space-y-6 border border-gray-800 animate-gradient">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-300 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-fade-in-up">
          Sign up for Amplifi
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
          />
          <input
            type="text"
            name="username"
            placeholder="Create Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-medium rounded-lg hover:scale-105 transition-all duration-300 glow-button animate-gradient"
          >
            Sign up
          </button>
        </form>

        <p className="mt-4 text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="relative text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-white bg-clip-text before:absolute before:left-0 before:bottom-0 before:w-full before:h-[2px] before:bg-gradient-to-r before:from-purple-400 before:via-blue-400 before:to-white before:content-[''] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
            style={{ animationDuration: "700ms" }}
          >
            Log in here!
          </Link>
        </p>
      </div>
    </div>
  );
}
