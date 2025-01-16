import React, { useState } from "react";
import "./style.css";
import Input from "../Input";
import Button from "../Button";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { auth, db, doc, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { getDoc, setDoc } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth/web-extension";

const SignupSignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
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
            navigate("/dashboard");
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
          navigate("/dashboard");
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

  function loginAsGuest() {
    setLoading(true);
    signInWithEmailAndPassword(auth, "gautamranjan96@gmail.com", "123456")
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        toast.success("User Logged In!");
        setLoading(false);
        navigate("/dashboard");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false);
        toast.error(errorMessage);
      });
  }

  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          toast.success("User Authenticated!");
          createDoc(user);
          navigate("/dashboard");
          setLoading(false);
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoading(false);
          toast.error(errorMessage);
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function createDoc(user) {
    setLoading(true);

    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const userData = await getDoc(userRef);

      if (!userData.exists()) {
        await setDoc(userRef, {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAT: new Date(),
          department: "",
          role: "",
          location: "",
          phone: "",
          bio: "",
          lastUpdated: new Date(),
          isProfileComplete: false,
        });

        toast.success("Account created successfully!");
      } else {
        // If doc exists, don't show error, just log in
        console.log("User document already exists");
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setLoading(true);
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        setLoading(false);
        toast.success("Password reset email sent! Check  your email.");
        setShowForgotPassword(false);
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
      }
    } else {
      toast.error("Please enter your email address!");
      setLoading(false);
    }
  }

  if (showForgotPassword) {
    return (
      <div className="signup-wrapper">
        <h2 className="title">
          Reset Password - <span style={{ color: "var(--theme" }}>Expencify.</span>
        </h2>
        <form>
          <Input type="email" label={"Email"} state={email} setState={setEmail} placeholder={"gautamranjan96@gmail.com"} />
          <Button disabled={loading} text={loading ? "Loading..." : "Send Reset Link"} onClick={handleForgotPassword} />
          <p className="p-login" style={{ cursor: "pointer" }} onClick={() => setShowForgotPassword(false)}>
            Back to Login
          </p>
        </form>
      </div>
    );
  }

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login on <span style={{ color: "var(--theme" }}>Expencify.</span>
          </h2>
          <form>
            <Input type="email" label={"Email"} state={email} setState={setEmail} placeholder={"gautamranjan96@gmail.com"} />
            <Input type="password" label={"Password"} state={password} setState={setPassword} placeholder={"Example@123"} />
            <p className="p-login" style={{ cursor: "pointer", margin: "0.5rem 0", textAlign: "left" }} onClick={() => setShowForgotPassword(true)}>
              Forgot Password?
            </p>
            <Button disabled={loading} text={loading ? "Loading..." : "Login Using Email and Password"} onClick={loginUsingEmail} />
            <p className="p-login">or</p>
            <Button onClick={googleAuth} text={loading ? "Loading..." : "Login Using Google"} blue={true} />
            <p className="p-login" style={{ cursor: "pointer" }} onClick={() => setLoginForm(!loginForm)}>
              or Don't Have An Account? Click Here
            </p>
          </form>
          <p className="p-login">or</p>
          <Button
            onClick={loginAsGuest}
            text={loading ? "Loading..." : "Login as Guest"}
            // blue={true}
          />
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "var(--theme" }}>Expencify.</span>
          </h2>
          <form>
            <Input label={"Full Name"} state={name} setState={setName} placeholder={"Gautam Ranjan"} />
            <Input type="email" label={"Email"} state={email} setState={setEmail} placeholder={"gautamranjan96@gmail.com"} />
            <Input type="password" label={"Password"} state={password} setState={setPassword} placeholder={"Example@123"} />
            <Input type="password" label={"Confirm Password"} state={confirmPassword} setState={setConfirmPassword} placeholder={"Example@123"} />
            <Button disabled={loading} text={loading ? "Loading..." : "Signup Using Email and Password"} onClick={signupWithEmail} />
            <p className="p-login">or</p>
            <Button onClick={googleAuth} text={loading ? "Loading..." : "Signup Using Google"} blue={true} />
            <p className="p-login" style={{ cursor: "pointer" }} onClick={() => setLoginForm(!loginForm)}>
              or Have An Account Already? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default SignupSignIn;
