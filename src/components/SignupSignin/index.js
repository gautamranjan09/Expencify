import React, { useState } from "react";
import "./style.css";
import Input from "../Input";
import Button from "../Button";

const SignupSignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="signup-wrapper">
      <h2 className="title">
        Sign Up on <span style={{ color: "var(--theme" }}>Expencify.</span>
      </h2>
      <form>
        <Input
          label={"Full Name"}
          state={name}
          setState={setName}
          placeholder={"Gautam Ranjan"}
        />
        <Input
          label={"Email"}
          state={email}
          setState={setEmail}
          placeholder={"gautamranjan96@gmail.com"}
        />
        <Input
          label={"Password"}
          state={password}
          setState={setPassword}
          placeholder={"Example@123"}
        />
        <Input
          label={"Confirm Password"}
          state={confirmPassword}
          setState={setConfirmPassword}
          placeholder={"Example@123"}
        />
        <Button text={"Signup Using Email and Password"}/>
        <p style={{textAlign:"center", margin: "0"}}>or</p>
        <Button text={"Signup Using Google"} blue={true}/>
      </form>
    </div>
  );
};

export default SignupSignIn;
