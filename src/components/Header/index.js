import React, { useEffect } from "react";
import "./style.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/appSlice";
import userImg from "../../assets/user.svg";

const Header = () => {
  const [user, loading] = useAuthState(auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
      dispatch(setUser(transformUser(user)));
    }
  }, [user, loading]);

  // Example function to transform the user object
  const transformUser = (user) => {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      // Add other properties as needed, but avoid non-serializable ones like methods or nested objects
    };
  };

  function logoutFnc() {
    try {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          toast.success("Logged out successfully!");
          navigate("/");
        })
        .catch((error) => {
          // An error happened.
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }
  return (
    <div className="navbar">
      <p className="logo">Expencify.</p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src={user?.photoURL ? user?.photoURL : userImg} style={{borderRadius: "50%", height:"1.5rem", width:"1.5rem"}}/>
          <p onClick={logoutFnc} className="logo link">
            Logout
          </p>
        </div>
      )}
    </div>
  );
};

export default Header;
