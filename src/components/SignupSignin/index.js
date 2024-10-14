import React, { useState } from "react";
import "./style.css";
import Input from "../Input";
import Button from "../Button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../firebase";

const SignupSignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function signupWithEmail() {
    setLoading(true);
    // Authenticate the user, or bassically create a new account using email and password
    if (name != "" && email != "" && password != "" && confirmPassword != "") {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            //Signed in
            const user = userCredential.user;
            toast.success("User Created!");
            setLoading(false);
            setName("");
            setPassword("");
            setEmail("");
            setConfirmPassword("");
            //Create A doc with user id as the following id
            createDoc(user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
      } else {
        toast.error("Password and Confirm Password do not match!");
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  function createDoc(){
    // Make sure that the doc with the  user id does not exist

  }

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
          type="email"
          label={"Email"}
          state={email}
          setState={setEmail}
          placeholder={"gautamranjan96@gmail.com"}
        />
        <Input
          type="password"
          label={"Password"}
          state={password}
          setState={setPassword}
          placeholder={"Example@123"}
        />
        <Input
          type="password"
          label={"Confirm Password"}
          state={confirmPassword}
          setState={setConfirmPassword}
          placeholder={"Example@123"}
        />
        <Button
          disabled={loading}
          text={loading ? "Loading..." : "Signup Using Email and Password"}
          onClick={signupWithEmail}
        />
        <p style={{ textAlign: "center", margin: "0" }}>or</p>
        <Button text={loading ? "Loading..." : "Signup Using Google"} blue={true} />
      </form>
    </div>
  );
};

export default SignupSignIn;
