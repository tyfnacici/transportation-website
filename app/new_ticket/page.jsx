"use client"
import React, { useState, useRef, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserContext } from "@/layout.jsx"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { generateId } from "@/components/utilities/index"
import CameraSVG from "../../public/assets/images/camera.svg"
import Image from "next/image"

const NewTicket = () => {
  const [optionValues, setOptionValues] = useState(null)
  const [ticketType, setTicketType] = useState("")
  const [ticketMessage, setTicketMessage] = useState("")
  const [file, setFile] = useState(null)
  const [imgUrl, setImgUrl] = useState(null)
  const [user, setUser] = useState(null)
  const fileInput = useRef(null)

  const router = useRouter()
  const storage = getStorage()

  const { userState } = useContext(UserContext)

  useEffect(() => {
    fetch(`${process.env.BASEURL}/support/get-support-types`).then((res) => {
      res.json().then((data) => {
        setOptionValues(data.data)
      })
    })

    setUser(userState.user)
  }, [userState, optionValues])

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
      const uploadedImageUrl = await uploadImage(file)

      if (uploadedImageUrl && user && ticketType && ticketMessage) {
        const supportData = {
          user: user._id,
          type: ticketType,
          description: ticketMessage,
          attachment: uploadedImageUrl,
        }
        const supportResponse = await fetch(
          `${process.env.BASEURL}/support/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(supportData),
          }
        )
        const supportResponseData = await supportResponse.json()

        router.push(`/dashboard/support`)
      }
    } catch (error) {
      console.error("Error: ", error)
    }
  }

  return (
    <div className="card p-[36px] rounded-[36px] bg-[#1A1A1A] justify-items-center text-center mt-[52px] mb-[136px] mx-auto flex flex-col">
      <h3 className="font-[700] text-[24px] pb-[33px] text-start">
        Yeni Destek Talebi
      </h3>
      <div className="flex flex-wrap space-x-6 max-md:justify-center max-md:space-x-0">
        <div className="space-y-[12px]">
          <div className="flex flex-row items-center w-[300px] rounded-[32px] relative justify-end bg-[#222222]">
            <svg
              width="28"
              height="28"
              className="ml-[20px] opacity-50 absolute left-0"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.0001 13.9584C9.66675 13.9584 9.33341 13.9334 9.01675 13.8751C7.25008 13.6167 5.64175 12.6001 4.62508 11.0917C3.91675 10.0251 3.54175 8.78341 3.54175 7.50008C3.54175 3.94175 6.44175 1.04175 10.0001 1.04175C13.5584 1.04175 16.4584 3.94175 16.4584 7.50008C16.4584 8.78341 16.0834 10.0251 15.3751 11.0917C14.3501 12.6084 12.7417 13.6168 10.9584 13.8834C10.6667 13.9334 10.3334 13.9584 10.0001 13.9584ZM10.0001 2.29175C7.12508 2.29175 4.79175 4.62508 4.79175 7.50008C4.79175 8.54175 5.09175 9.54175 5.65841 10.3917C6.48341 11.6084 7.77508 12.4251 9.20842 12.6334C9.74175 12.7251 10.2667 12.7251 10.7584 12.6334C12.2167 12.4251 13.5084 11.6001 14.3334 10.3834C14.9001 9.53341 15.2001 8.53341 15.2001 7.49174C15.2084 4.62507 12.8751 2.29175 10.0001 2.29175Z"
                fill="white"
              />
              <path
                d="M5.3916 18.8249C5.27493 18.8249 5.1666 18.8082 5.04993 18.7832C4.50826 18.6582 4.0916 18.2416 3.9666 17.6999L3.67493 16.4749C3.65826 16.3999 3.59993 16.3415 3.5166 16.3165L2.1416 15.9916C1.62493 15.8666 1.2166 15.4832 1.07493 14.9749C0.933263 14.4666 1.07493 13.9166 1.44993 13.5416L4.69993 10.2916C4.83326 10.1582 5.0166 10.0916 5.19993 10.1082C5.38326 10.1249 5.54993 10.2249 5.65826 10.3832C6.48326 11.5999 7.77493 12.4249 9.2166 12.6332C9.74993 12.7249 10.2749 12.7249 10.7666 12.6332C12.2249 12.4249 13.5166 11.5999 14.3416 10.3832C14.4416 10.2249 14.6166 10.1249 14.7999 10.1082C14.9833 10.0916 15.1666 10.1582 15.2999 10.2916L18.5499 13.5416C18.9249 13.9166 19.0666 14.4666 18.9249 14.9749C18.7833 15.4832 18.3666 15.8749 17.8583 15.9916L16.4833 16.3165C16.4083 16.3332 16.3499 16.3916 16.3249 16.4749L16.0333 17.6999C15.9083 18.2416 15.4916 18.6582 14.9499 18.7832C14.4083 18.9166 13.8499 18.7249 13.4999 18.2999L9.99993 14.2749L6.49993 18.3082C6.2166 18.6416 5.8166 18.8249 5.3916 18.8249ZM5.07493 11.6916L2.33326 14.4332C2.25826 14.5082 2.2666 14.5916 2.28326 14.6416C2.2916 14.6832 2.33326 14.7666 2.43326 14.7832L3.80826 15.1082C4.34993 15.2332 4.7666 15.6499 4.8916 16.1916L5.18326 17.4166C5.20826 17.5249 5.2916 17.5582 5.3416 17.5749C5.3916 17.5832 5.47493 17.5916 5.54993 17.5082L8.7416 13.8332C7.32493 13.5582 6.02493 12.7999 5.07493 11.6916ZM11.2583 13.8249L14.4499 17.4916C14.5249 17.5832 14.6166 17.5832 14.6666 17.5665C14.7166 17.5582 14.7916 17.5166 14.8249 17.4082L15.1166 16.1832C15.2416 15.6416 15.6583 15.2249 16.1999 15.0999L17.5749 14.7749C17.6749 14.7499 17.7166 14.6749 17.7249 14.6332C17.7416 14.5916 17.7499 14.4999 17.6749 14.4249L14.9333 11.6832C13.9749 12.7916 12.6833 13.5499 11.2583 13.8249Z"
                fill="white"
              />
              <path
                d="M11.575 10.7416C11.3584 10.7416 11.1 10.6833 10.7917 10.5L10 10.025L9.20837 10.4916C8.48337 10.925 8.00837 10.675 7.83337 10.55C7.65837 10.425 7.28337 10.05 7.47504 9.22497L7.67504 8.36663L7.00837 7.74995C6.6417 7.38328 6.50837 6.94163 6.63337 6.54163C6.75837 6.14163 7.12504 5.85829 7.6417 5.77495L8.53337 5.62496L8.95837 4.69163C9.20004 4.21663 9.57504 3.94995 10 3.94995C10.425 3.94995 10.8084 4.22497 11.0417 4.69997L11.5334 5.6833L12.3584 5.78329C12.8667 5.86663 13.2334 6.14995 13.3667 6.54995C13.4917 6.94995 13.3584 7.39162 12.9917 7.75829L12.3 8.44997L12.5167 9.22497C12.7084 10.05 12.3334 10.425 12.1584 10.55C12.0667 10.625 11.8667 10.7416 11.575 10.7416ZM8.00837 6.99164L8.58337 7.56661C8.85004 7.83328 8.98337 8.2833 8.90004 8.64996L8.7417 9.31662L9.40837 8.92495C9.7667 8.71662 10.25 8.71662 10.6 8.92495L11.2667 9.31662L11.1167 8.64996C11.0334 8.27496 11.1584 7.83328 11.425 7.56661L12 6.99164L11.275 6.86662C10.925 6.80828 10.575 6.54997 10.4167 6.2333L10 5.41663L9.58337 6.24996C9.43337 6.55829 9.08337 6.82497 8.73337 6.8833L8.00837 6.99164Z"
                fill="white"
              />
            </svg>
            <select
              onChange={(e) =>
                setTicketType(
                  e.target.value !== "Talep tipi seçin" ? e.target.value : ""
                )
              }
              className="h-[55px] text-[16px] font-[400] pl-[64px] bg-inherit focus:outline-none w-full rounded-[32px]"
            >
              <option defaultValue={"Talep tipi seçin"}>
                Talep tipi seçin
              </option>
              {optionValues ? (
                optionValues.map((option) => (
                  <option value={option} key={option + "1"}>
                    {option}
                  </option>
                ))
              ) : (
                <option value={""}>Loading...</option>
              )}
            </select>
            <svg
              width="28"
              height="28"
              viewBox="0 0 20 20"
              className="mr-[20px] absolute"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.5">
                <path
                  d="M14.9333 6.81665H9.74167H5.06667C4.26667 6.81665 3.86667 7.78332 4.43334 8.34998L8.75 12.6667C9.44167 13.3583 10.5667 13.3583 11.2583 12.6667L12.9 11.025L15.575 8.34998C16.1333 7.78332 15.7333 6.81665 14.9333 6.81665Z"
                  fill="white"
                />
              </g>
            </svg>
          </div>
          {/* Description Box */}
          <textarea
            onChange={(e) => setTicketMessage(e.target.value)}
            className="bg-[#222222] w-[300px] h-[102px] rounded-[16px]  leading-5 px-4 py-5"
            value={ticketMessage}
            placeholder="Ek Açıklama"
          />
          <div />
        </div>
        {/* File Upload */}
        <div>
          <div
            onClick={(e) => selectPhoto(e)}
            className="cursor-pointer relative file-upload !w-[300px] !h-[169px] rounded-[16px]   bg-[#222222]  "
          >
            {file ? (
              <img
                src={`${imgUrl ? imgUrl : URL.createObjectURL(file)}`}
                // width={96}
                // height={96}
                className=" rounded-2xl  w-full h-full  object-fill absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  object-cover  "
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
          </div>
          <div>
            <button
              onClick={() => setFile(null)}
              className=" bg-gradient-multiple mt-[36px]  font-bold !w-[145px] !h-[55px] !rounded-[16px] !text-[16px]   gradient-border"
            >
              <span className="  text-white opacity-50">Vazgeç</span>
            </button>
            <button
              onClick={() => onclickHandler()}
              className="btn_primary mt-[36px] font-bold !w-[145px] !h-[55px] !rounded-[16px] !text-[16px] ml-[10px] "
            >
              Talep Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewTicket
