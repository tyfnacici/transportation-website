"use client"
import React, { useState, useRef, useContext, useEffect } from "react"
import Image from "next/image"
import UseTextInput from "../../components/atoms/TextInput"
import CameraSVG from "../../../public/assets/images/camera.svg"
import CallSVG from "../../../public/assets/images/call.svg"
import UserProfile from "../../../public/assets/images/userProfile.svg"
import { UserContext } from "../../layout"
import { useRouter } from "next/navigation"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { generateId } from "../../components/utilities"

const EditProfile = () => {
  const [file, setFile] = useState(null)
  const fileInput = useRef(null)
  const [userName, setUserName] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [userImg, setUserImg] = useState("")
  const [imgUrl, setImgUrl] = useState(null)
  const storage = getStorage()
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const { userState, setUserState } = useContext(UserContext)

  const router = useRouter()

  useEffect(() => {
    if (userState.user) {
      setUserName(userState.user?.name)
      setUserPhone(userState.user?.phone)
      setUserImg(userState.user?.photo)
    }
  }, [userState])

  const handleUserPhone = (value) => {
    setUserPhone(value)
  }
  const handleUserName = (value) => {
    setUserName(value)
  }
  const uploadHandler = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
  }

  const selectPhoto = () => {
    if (!file) {
      fileInput.current.click()
    } else {
      setFile(null)
    }
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
      const photo = await uploadImage(file)
      if (photo) {
        const userUpdateData = {
          name: userName,
          photo: photo,
          id: userState.user._id,
          phone: userPhone,
        }

        // Kullanıcı bilgilerini güncelleme
        const updateUserResponse = await fetch(
          `${process.env.BASEURL}/user/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userUpdateData),
          }
        )
        const updatedUserData = await updateUserResponse.json()

        // Kullanıcıyı yeniden doğrulama
        const updatedUserResponse = await fetch(
          `${process.env.BASEURL}/user/auth`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ firebase_uid: userState.user.firebase_uid }),
          }
        )
        const updatedUser = await updatedUserResponse.json()

        localStorage.setItem("user", JSON.stringify(updatedUser.data))
        setUserState(updatedUser.data)

        setSuccessModalOpen(true)
      }
    } catch (error) {
      console.error("Error: ", error)
    }
  }

  if (successModalOpen) {
    setTimeout(() => {
      setSuccessModalOpen(false)
      router.push("/dashboard")
    }, 1250)
  }

  return (
    <div className="mx-auto">
      <h1 className="mb-[36px] dmsans70024">Profili Düzenle</h1>

      <div className="flex flex-row flex-wrap justify-center items-center">
        {successModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-[#1A1A1A] p-8 rounded-md shadow-md">
              <h2 className="text-xl font-bold mb-4">
                Profil Başarıyla Güncellendi!
              </h2>
            </div>
          </div>
        )}
        <div className="card !w-96 p-9 rounded-[36px] bg-[#1A1A1A] justify-items-center text-center">
          <div className=" relative file-upload !w-24 !h-24 rounded-full   bg-[#222222] mx-auto mt-9 mb-6">
            {file ? (
              <img
                src={`${imgUrl ? imgUrl : URL.createObjectURL(file)}`}
                width={96}
                height={96}
                className="rounded-full  !w-[96px] !h-[96px]  object-cover absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   "
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
                  className=" w-full  h-full    absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2"
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
                    <img
                      src={userImg ? userImg : UserProfile}
                      width={96}
                      height={96}
                      className="rounded-full  !w-[96px] !h-[96px]    object-cover absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  "
                      alt="camera icon "
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

          <div className="!max-w-[18.75rem] pt-[36px] flex flex-col">
            <div className="space-y-[12px]">
              <UseTextInput
                placeholder={userName}
                image={UserProfile}
                onValueChange={handleUserName}
              />
              <div className="flex flex-row items-center justify-end">
                <UseTextInput
                  disabled={true}
                  placeholder={userPhone}
                  image={CallSVG}
                  onValueChange={handleUserPhone}
                />
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="absolute mr-[20px]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.5609 10.7386L20.2009 9.15859C19.9409 8.85859 19.7309 8.29859 19.7309 7.89859V6.19859C19.7309 5.13859 18.8609 4.26859 17.8009 4.26859H16.1009C15.7109 4.26859 15.1409 4.05859 14.8409 3.79859L13.2609 2.43859C12.5709 1.84859 11.4409 1.84859 10.7409 2.43859L9.17086 3.80859C8.87086 4.05859 8.30086 4.26859 7.91086 4.26859H6.18086C5.12086 4.26859 4.25086 5.13859 4.25086 6.19859V7.90859C4.25086 8.29859 4.04086 8.85859 3.79086 9.15859L2.44086 10.7486C1.86086 11.4386 1.86086 12.5586 2.44086 13.2486L3.79086 14.8386C4.04086 15.1386 4.25086 15.6986 4.25086 16.0886V17.7986C4.25086 18.8586 5.12086 19.7286 6.18086 19.7286H7.91086C8.30086 19.7286 8.87086 19.9386 9.17086 20.1986L10.7509 21.5586C11.4409 22.1486 12.5709 22.1486 13.2709 21.5586L14.8509 20.1986C15.1509 19.9386 15.7109 19.7286 16.1109 19.7286H17.8109C18.8709 19.7286 19.7409 18.8586 19.7409 17.7986V16.0986C19.7409 15.7086 19.9509 15.1386 20.2109 14.8386L21.5709 13.2586C22.1509 12.5686 22.1509 11.4286 21.5609 10.7386ZM16.1609 10.1086L11.3309 14.9386C11.1909 15.0786 11.0009 15.1586 10.8009 15.1586C10.6009 15.1586 10.4109 15.0786 10.2709 14.9386L7.85086 12.5186C7.56086 12.2286 7.56086 11.7486 7.85086 11.4586C8.14086 11.1686 8.62086 11.1686 8.91086 11.4586L10.8009 13.3486L15.1009 9.04859C15.3909 8.75859 15.8709 8.75859 16.1609 9.04859C16.4509 9.33859 16.4509 9.81859 16.1609 10.1086Z"
                    fill="#FF6438"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={() => onclickHandler()}
              className="bg-[#FF6438] rounded-[16px] flex-grow h-[50px] dmsans50016 mt-[36px]"
            >
              Güncelle
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
