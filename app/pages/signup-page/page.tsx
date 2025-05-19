"use client";

import "@/app/styles/auth.css";
import "remixicon/fonts/remixicon.css";
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import EmailVerification from "./EmailVerification";
import Link from "next/link";
import AuthServices from "@/app/lib/services/auth/AuthenticationServices";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import { toggleVerifying } from "@/app/lib/redux/authReducer";


interface User {
  email: string,
  password: string,
  name: string,
  conPassword: string,
}

const gmailRegExp = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();


  const [userCredential, setUserCredential] = useState<User>({
    email: "",
    name: "",
    password: "",
    conPassword: "",
  });

  const [isGmailValid, setIsGmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [isAccept, setIsAccept] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSendingCode, setSendingCode] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const authServices = new AuthServices({
    name: userCredential.name,
    email: userCredential.email,
    password: userCredential.password,
  }, dispatch);


  const isVerifying = useSelector((state: RootState) => state.auth.isVerifying);


  //// FUNCTIONS 

  const handleText = (event: React.ChangeEvent<HTMLInputElement>) => {

    const value = event.target.value;
    const name = event.target.name;

    setUserCredential({ ...userCredential, [name]: value });
  }


  //// monitor credentials if valid
  useEffect(() => {

    checkGmail();
    checkPassword();

  }, [userCredential]);

  const checkPassword = () => {
    if (userCredential.password.length >= 8 && userCredential.password != userCredential.conPassword) {
      setIsPasswordValid(false);
      setPasswordMsg("Password did not match");
    } else if (userCredential.password.length < 8) {
      setIsPasswordValid(false);
      setPasswordMsg("Password character must at least 8 or more");
    } else {
      setIsPasswordValid(true);
    }
  }

  const checkGmail = () => {
    if (gmailRegExp.test(userCredential.email)) {
      setIsGmailValid(true);
    } else if (userCredential.email === "") {
      setIsGmailValid(false);
    } else {
      setIsGmailValid(false);
    }
  }

  const handleSubmit = async () => {



    if (!isGmailValid || !isPasswordValid || !isAccept || !userCredential.name) {
      setSignUpError("Required fields are empty");
      setTimeout(() => {
        setSignUpError("");
      }, 5000);
    } else {
      setSendingCode(true);


      const isExisting = await authServices.checkEmailExistence();

      if (isExisting) {
        setErrorMessage("Email address is exisiting");
        setError(true);
        setSendingCode(false);
        setTimeout(() => {
          setErrorMessage("");
          setError(false);
        }, 3000);
      } else {
        const status = await authServices.sendCode();

        if (status === "error") {
          setSendingCode(false);
          setError(true);
          setErrorMessage("Sending code error");
          setTimeout(() => {
            setError(false);
          }, 5000);
        } else {
          setSendingCode(false);
          dispatch(toggleVerifying());
        }
      }
    }
  }


  const handleShowPassword = () => {
    setShowPassword(true);
    setTimeout(() => {
      setShowPassword(false);
    }, 1000);
  }



  ///// COMPONENTS

  const upperShape = <>
    <div className="upper-shape"></div>
  </>


  const bottomShape = <>
    <div className="bottom-shape">
      <div className="main-con">
        <div className="bottom-right-obj"></div>
        <div className="bottom-obj"></div>
        <div className="with-shadow"></div>
      </div>
    </div></>

  const errorComponent = (message: string, show: boolean) => <motion.div className="error-msg"
    animate={{
      height: show ? "auto" : "0px",
      marginBottom: show ? "20px" : "0px",
    }}
  >
    <span>{message}
    </span>
  </motion.div>



  return (
    <div className="signup-form">
      {upperShape}
      {bottomShape}

      <div className="main-body">
        <div className="title">
          <p>Create Your Account</p>
          <p>Please enter your details to Sign Up</p>
        </div>

        <div className="form">
          <p>Sign Up</p>
          <motion.div className="w-full bg-red-400 text-white rounded-[11px]"
            animate={{
              marginBottom: error ? "15px" : "0px",
              height: error ? "fit-content" : "0px",
              padding: error ? "15px" : "0px",
            }}

          >{error && <span>{errorMessage}</span>}</motion.div>

          <input type="text"
            name="name"
            value={userCredential.name}
            placeholder="Enter your name"
            maxLength={60}
            onChange={handleText} />

          <input type="text"
            name="email"
            placeholder="Enter your email...."
            value={userCredential.email}
            required
            onChange={handleText}
          />
          {errorComponent("Invalid Email", userCredential.email != "" && !isGmailValid)}
          <div className="passwords">
            <input type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password" value={userCredential.password}
              required
              onChange={handleText}
            />
            <div className="eye-con" onClick={handleShowPassword}>
              {showPassword ? <i className="ri-eye-fill"></i> : <i className="ri-eye-off-fill"></i>}
            </div>
          </div>
          {errorComponent(passwordMsg, userCredential.password != "" && !isPasswordValid)}
          <div className="passwords">
            <input type={showPassword ? "text" : "password"}
              name="conPassword"
              placeholder="Confirm Password"
              value={userCredential.conPassword}
              required
              onChange={handleText}
            />
            <div className="eye-con" onClick={handleShowPassword}>
              {showPassword ? <i className="ri-eye-fill"></i> : <i className="ri-eye-off-fill"></i>}
            </div>
          </div>

          <div className="terms-con">
            <div className="checkbox"
              onClick={() => setIsAccept(!isAccept)}
            >
              <motion.i className="ri-check-line"

                animate={{
                  scale: isAccept ? 1 : 0,
                }}
              ></motion.i>
            </div>
            <span>I accept the Terms and Conditions</span>
          </div>
          {errorComponent(signUpError, signUpError != "")}

          <span
            className="text-gray-500 place-self-center mb-4.5 mt-4.5"
          >Do you have an account?<Link href={"/pages/login-page"}>
              <span
                className="text-gray-700 font-bold underline"> Go to Login Page

              </span>
            </Link>
          </span>

          <button type="submit" onClick={handleSubmit}>
            {isSendingCode ? <> <div className="loading-indicator"></div> Sending Code </> : <span>Sign up</span>}
          </button>
        </div>

      </div>
      {isVerifying && < EmailVerification
        dispatch={dispatch}
        credentials={userCredential}
        router={router} />}
    </div>
  )
}

export default LoginPage;
