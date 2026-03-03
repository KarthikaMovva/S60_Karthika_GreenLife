import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase/firebase";

function Signup() {
  const [UserName, setUserName] = useState("");
  const [Gmail, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState("");
  const [error, setError] = useState("");
  const [googleUser, setGoogleUser] = useState(null);

  const navigate = useNavigate();

  // ================= GOOGLE SIGNUP =================
  const handleGoogleSignIn = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);

      setGoogleUser(result.user);

      // Auto-fill username and email (readonly)
      setUserName(result.user.displayName);
      setEmail(result.user.email);

    } catch (err) {
      console.log("Google signup error:", err);
      toast.error("Google Sign-in failed");
    }
  };

  // ================= SIGNUP SUBMIT =================
  const postUsers = async (event) => {
    event.preventDefault();

    // Always validate password match
    if (Password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const userData = {
      UserName,
      Gmail,
      Password,
      role: selectedRoles || "user",
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/postuser",
        userData
      );

      localStorage.setItem("token", response.data.token);
      toast.success("Signup successful!");
      navigate("/order");

    } catch (err) {
      console.log("Signup error:", err);
      toast.error("Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex items-center justify-center flex-grow">
        <div className="bg-white shadow-md rounded-lg w-11/12 md:w-2/3 lg:w-1/2 flex overflow-hidden">

          {/* LEFT SIDE */}
          <div className="w-full md:w-1/2 p-6 bg-gray-50">
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
                onClick={handleGoogleSignIn}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  alt="Google"
                  className="h-5 w-5 mr-3"
                />
                Sign up with Google
              </button>
            )}

            {/* GOOGLE WELCOME MESSAGE */}
            {googleUser && (
              <p className="text-sm text-gray-600 font-medium mt-5 mb-5 text-center">
                🌱 Welcome{" "}
                <b className="text-green-600 text-lg">
                  {googleUser.displayName}
                </b>
                ! Please create a password to complete your signup.
              </p>
            )}

            <form onSubmit={postUsers}>

              {/* Show Username & Email only for normal signup */}
              {!googleUser && (
                <>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full px-4 py-2 mb-3 border rounded-md"
                    value={UserName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 mb-3 border rounded-md"
                    value={Gmail}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </>
              )}

              {/* ALWAYS show password fields after Google OR normal */}
              {(googleUser || !googleUser) && (
                <>
                  <input
                    type="password"
                    placeholder="Create Password"
                    className="w-full px-4 py-2 mb-3 border rounded-md"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 mb-4 border rounded-md"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </>
              )}

              {/* ROLE SELECTION */}
              <h3 className="font-semibold mb-3">Select Your Role:</h3>

              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value="user"
                    checked={selectedRoles === "user"}
                    onChange={(e) => setSelectedRoles(e.target.value)}
                  />
                  <span>Do you want to buy plants?</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value="merchant"
                    checked={selectedRoles === "merchant"}
                    onChange={(e) => setSelectedRoles(e.target.value)}
                  />
                  <span>Do you want to sell plants?</span>
                </label>
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-3">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 mt-8 rounded-md shadow hover:bg-green-600 transition"
              >
                Signup
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Login
              </a>
            </p>

          </div>

          {/* RIGHT IMAGE */}
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

export default Signup;