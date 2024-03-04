"use client"
import Image from "next/image"
import { useEffect, useRef, useState, useContext } from "react"
import CameraSVG from "../../public/assets/images/camera.svg"
import UseTextInput from "./atoms/TextInput"
import UserProfile from "../../public/assets/images/userProfile.svg"
import { useRouter } from "next/navigation"
import auth from "../firebase/firebase-config.js"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { UserContext } from "@/layout.jsx"
import { updateProfile } from "firebase/auth"
import { generateId } from "./utilities"
import { Await } from "react-router-dom"

const CreateProfileCard = () => {
  const [data, setData] = useState([])
  const { userState, setUserState } = useContext(UserContext)
  const [file, setFile] = useState(null)
  const fileInput = useRef(null)
  const [userName, setUserName] = useState("")
  const [imgUrl, setImgUrl] = useState(null)
  const [result, setResult] = useState(null)
  const [userPhone, setUserPhone] = useState("")
  const router = useRouter()
  const storage = getStorage()

  useEffect(() => {
    setUserPhone(auth?.currentUser?.phoneNumber)
  }, [])

  const handleUserName = (value) => {
    setUserName(value)
  }

  const selectPhoto = () => {
    if (!file) {
      fileInput.current.click()
    } else {
      setFile(null)
    }
  }

  const uploadHandler = (e) => {
    const selectedFile = e.target.files[0]

    setFile(selectedFile)
  }
  const uploadImage = async (file) => {
    try {
      const storageRef = ref(storage, `images/${generateId()}`)
      const snapshot = await uploadBytes(storageRef, file)
      const url = await getDownloadURL(snapshot.ref)
      setImgUrl(url)
      return url
    } catch (error) {
      console.error("Error uploading image: ", error)
      throw error
    }
  }

  const onclickHandler = async () => {
    try {
      const uploadedImageUrl = await uploadImage(file)

      await updateProfile(auth.currentUser, {
        displayName: userName,
        photoURL: uploadedImageUrl,
      })

      const postData = {
        name: userName,
        photo: uploadedImageUrl,
        phone: userPhone,
        firebase_uid: auth.currentUser.uid,
      }

      await fetch(`${process.env.BASEURL}/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then((data) => data?.json())
        .then((data) => {
          setResult(data)
        })
      await fetch(`${process.env.BASEURL}/user/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firebase_uid: auth.currentUser.uid }),
      })
        .then((data) => data?.json())
        .then((data) => {
          localStorage.setItem("user", JSON.stringify(data?.data))

          setUserState(data?.data)
        })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error: ", error)
    }
  }

  return (
    <div className="card w-[18rem] sm:w-[22rem] md:!w-96 p-9 flex flex-col rounded-[36px] bg-[#1A1A1A] justify-items-center text-center mx-auto">
      <h3 className="font-[400] text-[16px] text-[#FF6438] pb-[10px]">
        Hoş geldiniz
      </h3>
      <h3 className="dmsans70024">Profil Oluştur</h3>

      <div className=" relative file-upload !w-24 !h-24 rounded-full   bg-[#222222] mx-auto mt-9 mb-6">
        {file ? (
          <img
            src={`${imgUrl ? imgUrl : URL.createObjectURL(file)}`}
            width={96}
            height={96}
            className="rounded-full  !w-[96px] !h-[96px]  object-fill absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   "
            alt="profile image"
          />
        ) : (
          <>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              name="file"
              onChange={(e) => uploadHandler(e)}
              className=" bg-[#222222] "
              style={{ display: "none" }}
            />
            <label
              htmlFor="file"
              className="  absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2"
            >
              {file ? (
                <Image
                  src={URL.createObjectURL(file)}
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                  alt="profile image"
                />
              ) : (
                <Image
                  src={CameraSVG}
                  width={30}
                  height={30}
                  alt="camera icon"
                />
              )}
            </label>
          </>
        )}
        <button
          className="btn_primary !w-[4.375rem] !h-8 !rounded-full dmsans50014  absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 z-10"
          onClick={(e) => selectPhoto(e)}
        >
          {file ? "Sil" : "Ekle"}
        </button>
      </div>
      <div className="flex flex-col pt-[24px]">
        <UseTextInput
          placeholder={"Adınız"}
          image={UserProfile}
          onValueChange={(value) => handleUserName(value)}
        />
        <button
          onClick={() => onclickHandler()}
          className="btn_primary !w-full flex-grow !h-[50px] rounded-2xl dmsans50016 mt-6"
        >
          Tamamla
        </button>
      </div>
    </div>
  )
}

export default CreateProfileCard
