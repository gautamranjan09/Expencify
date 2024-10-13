import React from "react";
import Header from "../components/Header";
import SignupSignIn from "../components/SignupSignin";

const Signup = () => {
  return (
    <>
      <Header />
      <div className="wrapper">
        <SignupSignIn/>
      </div>
    </>
  );
};

export default Signup;
