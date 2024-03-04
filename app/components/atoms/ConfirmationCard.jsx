"use client";
import React, { useEffect, useState, useContext } from "react"
import { Dialog } from "primereact/dialog"
import ReactCodeInput from "react-code-input"
import auth from "../../firebase/firebase-config.js"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { redirect } from "next/dist/server/api-utils/index.js"
// import { checkUserAuthentication } from "../utilities/index.js"
import { useRouter } from "next/navigation"
import { UserContext } from "@/layout.jsx"

const ConfirmationCard = ({ phoneNumber }) => {
  const [verificationCode, setVerificationCode] = useState(null)
  const [confirmationResult, setConfirmationResult] = useState(null)
  const [remainingTime, setRemainingTime] = useState(59)
  const [resendDisabled, setResendDisabled] = useState(true)
  const { userState, setUserState } = useContext(UserContext)

  const SetUpRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          onSignInSubmit()
        },
      }
    )
  }

  const onSignInSubmit = () => {
    let appVerifier = window.recaptchaVerifier
    signInWithPhoneNumber(auth, phoneNumber, appVerifier).then(
      (confirmationResult) => {
        setConfirmationResult(confirmationResult)
      }
    )
  }

  const handleSendCode = async () => {
    try {
      SetUpRecaptcha()
      onSignInSubmit()
      setResendDisabled(true)

      if (!resendDisabled) {
        startCountdown((remainingTime) => {
          setRemainingTime(remainingTime)
        })
      }
    } catch (error) {
      console.error("Error sending code", error)
    }
  }

  function startCountdown(callback) {
    const targetTime = new Date().getTime() + 59 * 1000 // 59 seconds from now
    const intervalId = setInterval(() => {
      const currentTime = new Date().getTime()
      const remainingTime = targetTime - currentTime
      const seconds = Math.floor(remainingTime / 1000)
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds
      callback(`${formattedSeconds}`)
      if (remainingTime <= 1) {
        clearInterval(intervalId)
        setRemainingTime(59)
        setResendDisabled(false)
      }
    }, 1000)
  }
  const router = useRouter()
  useEffect(() => {
    setVerificationCode(null)
    handleSendCode()
    setTimeout(() => {
      startCountdown((remainingTime) => {
        setRemainingTime(remainingTime)
      })
    }, 1000)
  }, [])
  const handleVerifyCode = async () => {
    const code = verificationCode
    if (code) {
      try {
        const result = await confirmationResult.confirm(code)

        const postData = {
          firebase_uid: result.user.uid,
        }

        await fetch(`${process.env.BASEURL}/user/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        })
          .then((response) => response.json())
          .then((json) => {
            setUserState(json.data)
            localStorage.setItem("user", JSON.stringify(json.data))
            if (
              json.data.is_registered === true &&
              json.data.user.is_deleted === false
            ) {
              router.push("/dashboard")
            } else if (json.data.is_registered === false) {
              router.push("/create-profile")
            } else {
              router.push("/")
            }
          })
      } catch (error) {
        console.error("Error verifying code:", error)
      }
    }
  }

  const inputElementStyle = {
    className: "dmsans70024",
    inputStyle: {
      margin: "0px",
      MozAppearance: "",
      width: "48px",
      borderRadius: "16px",
      fontSize: "24px",
      lineheight: "31px",
      height: "48px",
      backgroundColor: "#212121",
      textAlign: "center",
      marginRight: "4px",
      marginLeft: "4px",
      color: "white ",
      border: "none",
      outline: "none",
    },
  }

  return (
    <div className="w-[398px]  rounded-[32px] bg-[#1A1A1A] pl-[30px] pt-[36px] ">
      <div className="card flex justify-content-center ">
        <div className=" items-start">
          <p className="dmsans40018 text-white">6 haneli kod</p>
          <p className="dmsans40016 opacity-50 mt-2">
            Doğrulama kodunuz {phoneNumber} <br /> adresine başarıyla gönderildi
          </p>
          <div className="flex flex-nowrap mt-[23px]">
            <ReactCodeInput
              type="number"
              fields={6}
              {...inputElementStyle}
              className=" "
              onChange={(value) => setVerificationCode(value)}
            />
            {/* <div className=" mx-[1px]  flex flex-row justify-center text-center align-middle py-[13px] ">
              <p className="w-[9px] h-[21px] opacity-50 dmsans40016">-</p>
            </div>
            <ReactCodeInput
              type="number"
              fields={3}
              {...inputElementStyle}
              className=""
              onChange={(value) =>
                setVerificationCode((prev) => (prev += value))
              }
            /> */}
          </div>
          <div id="recaptcha-container"></div>
          <p className="dmsans40016 opacity-50 mt-[28px]">
            00:{remainingTime} sonra tekrar gönder
          </p>
          <button
            id="sign-in-button"
            className={`text-[#FF6438] underline mt-[16px]  !w-[105px] ${
              resendDisabled ? "opacity-50 text-white" : ""
            }`}
            disabled={resendDisabled}
            onClick={handleSendCode}
            style={{ width: "100%" }}
          >
            Tekrar gönder
          </button>
          <button
            className="btn_primary mt-[23px] mb-[29px]"
            onClick={handleVerifyCode}
          >
            Doğrula
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationCard;
