import React, { useEffect } from "react";
import "./style.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/appSlice";

const Header = () => {
  const [user, loading] = useAuthState(auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
      dispatch(setUser(user));
    }
  }, [user, loading]);

  function logoutFnc() {
    try {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          toast.success("Logged out successfully!");
          navigate('/');
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
        <p onClick={logoutFnc} className="logo link">
          Logout
        </p>
      )}
    </div>
  );
};

export default Header;
