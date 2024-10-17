import React, { useState } from "react";
import "./style.css";
import Input from "../Input";
import Button from "../Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import { auth, db, doc } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { getDoc, setDoc } from "firebase/firestore";

const SignupSignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


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
            navigate('/dashboard');
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

  function loginUsingEmail() {
    setLoading(true);
    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success("User Logged In!");
          setLoading(false);
          navigate('/dashboard');
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoading(false);
          toast.error(errorMessage);
        });
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

 async function createDoc() {
    // Make sure that the doc with the  user id does not exist
    setLoading(true);

    if(!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()){
        // Create a new document with the user's data
        try{
            await setDoc(doc(db, "users", user.uid),{
                name: user.displayName ? user.displayName : name,
                email:  user.email,
                photoURL:  user.photoURL ? user.photoURL : "",
                createdAT: new Date(),
            });
            setLoading(false);
            toast.success("Doc created!");
        } catch(e){
            toast.error(e.message);
            setLoading(false);
        }
    }  else {
        toast.error("Doc already exists!");
        setLoading(false);
    }
  }

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login on <span style={{ color: "var(--theme" }}>Expencify.</span>
          </h2>
          <form>
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
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login Using Email and Password"}
              onClick={loginUsingEmail}
            />
            <p className="p-login">or</p>
            <Button
              text={loading ? "Loading..." : "Login Using Google"}
              blue={true}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              or Don't Have An Account? Click Here
            </p>
          </form>
        </div>
      ) : (
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
            <p className="p-login">or</p>
            <Button
              text={loading ? "Loading..." : "Signup Using Google"}
              blue={true}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              or Have An Account Already? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default SignupSignIn;
