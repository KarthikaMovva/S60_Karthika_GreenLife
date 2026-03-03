import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase/firebase";

function Login() {
  const [Gmail, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [googleUser, setGoogleUser] = useState(null);

  const navigate = useNavigate();

  // ================= GOOGLE LOGIN =================
  const handleGoogleLogin = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      setGoogleUser(user);
      toast.success("Google Sign-in successful 🌿");

    } catch (err) {
      console.log("Google login error:", err);
      toast.error("Google Sign-in failed");
    }
  };

  // ================= LOGIN SUBMIT =================
  const handleLogin = async (event) => {
    event.preventDefault();

    if (googleUser && !selectedRole) {
      setError("Please select your role");
      return;
    }

    const loginData = {
      UserName: googleUser ? googleUser.displayName : "",
      Gmail: googleUser ? googleUser.email : Gmail,
      Password: googleUser ? googleUser.uid : Password,
      role: googleUser ? selectedRole : undefined,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        loginData
      );

      localStorage.setItem("token", response.data.jwtToken);
      toast.success("Login successful 🌱");
      navigate("/order");

    } catch (err) {
      console.log("Login error:", err);
      toast.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex items-center justify-center flex-grow">
        <div className="bg-white shadow-md rounded-lg w-11/12 md:w-2/3 lg:w-1/2 flex overflow-hidden">

          {/* LEFT SIDE */}
          <div className="w-full md:w-1/2 p-6 bg-gray-50">

            {/* LOGO */}
            <img
              src="https://i.postimg.cc/WzTXNF67/Capstone-Project-1.png"
              alt="Logo"
              className="h-20 mx-auto mb-6"
            />

            {/* GOOGLE BUTTON */}
            {!googleUser && (
              <button
                type="button"
                className="flex items-center justify-center bg-green-300 text-white w-full py-2 rounded-md shadow mb-4 transition hover:bg-green-400"
                onClick={handleGoogleLogin}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  alt="Google"
                  className="h-5 w-5 mr-3"
                />
                Sign in with Google
              </button>
            )}

            {/* GOOGLE WELCOME MESSAGE */}
            {googleUser && (
              <p className="text-sm text-gray-600 font-medium mt-5 mb-5 text-center">
                🌿 Welcome back{" "}
                <b className="text-green-600 text-lg">
                  {googleUser.displayName}
                </b>
                ! Your garden missed you.  
                Just choose your role to continue growing.
              </p>
            )}

            {!googleUser && (
              <div className="text-center text-gray-600 text-sm mb-4">
                Or login with email
              </div>
            )}

            {/* LOGIN FORM */}
            <form onSubmit={handleLogin}>

              {!googleUser && (
                <>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={Gmail}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </>
              )}

                <>
                  <h3 className="font-semibold mb-3">Select Your Role:</h3>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        value="user"
                        checked={selectedRole === "user"}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      />
                      <span>Buy Plants 🌿</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        value="merchant"
                        checked={selectedRole === "merchant"}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      />
                      <span>Sell Plants 🌱</span>
                    </label>
                  </div>
                </>

              {error && (
                <p className="text-red-500 text-sm mt-3">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 mt-8 rounded-md shadow hover:bg-green-600 transition"
              >
                Login
              </button>
            </form>

            {/* SIGNUP NAVIGATION */}
            <p className="text-center text-sm mt-4">
              Don’t have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Signup
              </a>
            </p>

          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="hidden md:block md:w-1/2">
            <img
              src="https://thumbs.dreamstime.com/b/wooden-planter-box-green-plants-welcome-sign-326072606.jpg"
              alt="Welcome"
              className="h-full w-full object-cover"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
export default Login;