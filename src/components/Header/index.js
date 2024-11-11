import React, { useEffect, useState } from "react";
import "./style.css";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/appSlice";
import userImg from "../../assets/user.svg";
import { doc, getDoc } from "firebase/firestore";

const Header = () => {
  const [user, loading] = useAuthState(auth);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [profile, setProfile] = useState({}); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      checkProfileComplete();
      dispatch(setUser(transformUser(user)));
    }
  }, [user, loading]);

  const checkProfileComplete = async () => {
    if (!user?.uid) return;
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      // Check if required fields are filled
      setProfile(data);
      const isComplete = data.department && data.role && data.phone && data.location && data.photoURL;
      setIsProfileComplete(isComplete);
    }
  };

  const transformUser = (user) => {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  };

  function logoutFnc() {
    try {
      signOut(auth)
        .then(() => {
          toast.success("Logged out successfully!");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="navbar">
      <p className="logo" onClick={() => navigate("/dashboard")}>Expencify.</p>
      {user && (
        <div className="profile-section">
          {!isProfileComplete && (
            <span className="profile-incomplete">Profile Incomplete</span>
          )}
          <div className="profile-controls">
            <img 
              src={profile?.photoURL ? profile?.photoURL : userImg} 
              className="profile-pic"
              onClick={handleProfileClick}
              alt="Profile"
            />
            <p onClick={logoutFnc} className="logo link">
              Logout
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;