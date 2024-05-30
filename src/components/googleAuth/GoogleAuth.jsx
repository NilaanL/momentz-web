import { auth, googleProvider } from "../../dbConfig/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";
import "./GoogleAuth.css"; // Import the CSS file for styling

const GoogleAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result);
      // Store username in local storage
      const username = result.user.displayName || result.user.email;
      localStorage.setItem("username", username);
    } catch (error) {
      console.log(error);
    }
  };

  const signOutWithGoogle = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      localStorage.removeItem("username"); // Optionally remove username from local storage
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth-container">
      <input
        placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}
        className="auth-input"
      />
      <input
        placeholder="Password..."
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        className="auth-input"
      />

      <button onClick={signInWithGoogle} className="auth-button">
        Sign In With Google
      </button>

      <button onClick={signOutWithGoogle} className="auth-button">
        Logout
      </button>
    </div>
  );
};

export default GoogleAuth;
