"use client"
import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useContext,
  useMemo,
} from "react"
import ChatInfoCard from "./atoms/chatInfoCard.jsx"
import Image from "next/image"
import userImage from "../../public/assets/images/userImage.png"
import ArrowRightSvg from "../../public/assets/images/arrow-right.svg"
import MoreSVG from "../../public/assets/images/more.svg"
import paperPlaneSVG from "../../public/assets/images/paper-plane.svg"
import NewOfferChatCard from "./atoms/NewOfferChatCard.jsx"
import TimestampComponent from "./atoms/TimestampComponent.jsx"
import { formatDate } from "./utilities"
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  addDoc,
} from "firebase/firestore"
import { db } from ".././firebase/firebase-config.js"
import auth from ".././firebase/firebase-config.js"
import { generateId, AuthContext } from "./utilities"
import ImagePreview from "./atoms/ImagePreview.jsx"
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage"
import { useRouter } from "next/navigation.js"
import { UserContext } from "@/layout.jsx"

const Chat = (props) => {
  const [messages, setMessages] = useState([])
  const [transporter, setTransporter] = useState("")
  const [offer, setOffer] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [uploadModalVisible, setUploadModalVisible] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [conversation, setConversation] = useState(null)
  const [imgUrl, setImgUrl] = useState(null)
  const [sendImage, setSendImage] = useState(null)
  const [reciever, setReciever] = useState(null)
  const [sender, setSender] = useState(null)
  const [progress, setProgress] = useState(0)
  const Router = useRouter()
  const modalRef = useRef()
  const { updateChatMessages } = props
  const { userState } = useContext(UserContext)
  const messagesContainerRef = useRef(null)
  const scroll = useRef(null)
  console.log("sender", sender)
  useEffect(() => {
    if (props) {
      setConversation(props.chat)
      setOffer(props.chat?.listing)
      setTransporter(props.chat?.transporter)

      const senderId = userState.user?._id
      setReciever(
        senderId === userState.user?._id
          ? conversation?.transporter
          : conversation?.user
      )
      setSender(
        senderId === userState.user?._id
          ? conversation?.user
          : conversation?.transporter
      )
    }
  }, [props, userState, conversation?.transporter, conversation?.user])

  const storage = getStorage()

  const handleSendMessage = (e) => {
    e.preventDefault()
    sendNewMessage(newMessage, imgUrl)
    setNewMessage("")
  }

  const sendNewMessage = async (newMessage, media_url) => {
    if (newMessage || media_url) {
      let newMessageObject

      if (props.chatType !== "Ticket") {
        newMessageObject = {
          from: sender._id, // sender id
          media_url: media_url,
          message: newMessage,
          message_at: serverTimestamp(),
          to: reciever?._id, // transporter id
        }
      } else {
        newMessageObject = {
          from: sender._id, // sender id
          media_url: media_url,
          message: newMessage,
          message_at: serverTimestamp(),
        }
      }

      if (props.chatType === "Ticket") {
        await addDoc(
          collection(db, `support/${props.chat._id}/messages`),
          newMessageObject
        )
      } else {
        await addDoc(
          collection(db, `chats/${props.chat._id}/messages`),
          newMessageObject
        )
      }
      if (props.chat._id) {
        let lastMessage

        if (media_url && !newMessage.trim()) {
          if (sendImage && !sendImage.type.startsWith("image/")) {
            lastMessage = "Sizinle bir dosya paylaştı."
          } else {
            lastMessage = "Sizinle bir fotoğraf paylaştı."
          }
        } else {
          lastMessage = newMessage
        }

        await fetch(`${process.env.BASEURL}/chat/update-last-message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat: props.chat._id,
            last_message: lastMessage,
          }),
        }).then((res) => {
          if (res.status === 200) {
            updateChatMessages(props.chat._id, lastMessage)
          }
        })
      }

      setNewMessage("")
      setImgUrl(null)
      setSendImage(null)
    }
  }

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `images/${generateId()}`)
    await uploadBytes(storageRef, file).then((value) => {
      getDownloadURL(value.ref).then((url) => {
        setImgUrl(url)
        sendNewMessage(newMessage, url)
      })
    })
  }
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])
  const handleImageChange = (e) => {
    const file = e.target?.files[0]
    if (!file) return

    if (file.type.startsWith("image/")) {
      setSendImage(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setUploadModalVisible(true)
      }
      reader.readAsDataURL(file)
    } else {
      setSendImage(file)
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
      }
      setUploadModalVisible(true)
    }
  }
  const handleFileUpload = async (file) => {
    if (file) {
      const storageRef = ref(storage, `files/${generateId()}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const uploadProgress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          )
          setProgress(uploadProgress)
        },
        (error) => {
          console.error("Error uploading file: ", error)
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

            sendNewMessage(newMessage, downloadURL)
          } catch (error) {
            console.error("Error getting download URL:", error)
          }
        }
      )
    } else {
      console.error("No file selected")
    }
  }
  const sendImagePreview = () => {
    if (sendImage?.type.startsWith("image/")) {
      uploadImage(sendImage)
    } else {
      handleFileUpload(sendImage)
    }
    setUploadModalVisible(false)
  }

  const openImageModal = (selectedImageUrl) => {
    setSelectedImage(selectedImageUrl)
    setModalVisible(true)
  }
  const closePreviewModal = () => {
    setUploadModalVisible(false)
    setImagePreview("")
    setSendImage("")
  }

  const closeImageModal = () => {
    setSelectedImage(null)
    setModalVisible(false)
  }

  const handleModalClick = (e) => {
    if (e?.target?.classList.contains("modal-overlay")) {
      closeImageModal()
    }
    if (!modalRef?.current?.contains(e?.target)) {
      closeImageModal()
      closePreviewModal()
    }
  }

  useEffect(() => {
    if (props.chat && props.chatType !== "Ticket") {
      const q = query(
        collection(db, `chats/${props.chat?._id}/messages`),
        orderBy("message_at")
      )
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const chats = []
        querySnapshot.forEach((doc) => {
          chats.push({ ...doc.data(), id: doc.id })
        })

        setMessages(chats)
      })
      return () => unsubscribe()
    } else if (props.chat && props.chatType === "Ticket") {
      const q = query(
        collection(db, `support/${props.chat?._id}/messages`),
        orderBy("message_at")
      )
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const chats = []
        querySnapshot.forEach((doc) => {
          chats.push({ ...doc.data(), id: doc.id })
        })

        setMessages(chats)
      })
      return () => unsubscribe()
    }
  }, [props])

  const TimestampComponent = (sentTime) => {
    if (!sentTime) return null // Handle invalid sentTime

    const date = new Date(sentTime.toDate()) // Convert Firebase timestamp to JavaScript Date object

    const monthNames = [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ]

    const formattedDate = `${date.getDate()} ${
      monthNames[date.getMonth()]
    }, ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`

    return (
      <span className="dmsans40012 opacity-50 mt-[8px]">{formattedDate}</span>
    )
  }

  return (
    <>
      {modalVisible && (
        <div
          ref={modalRef}
          className="fixed  top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center modal-overlay z-50"
          onClick={(e) => handleModalClick(e)}
        >
          <ImagePreview previewUrl={selectedImage} />
        </div>
      )}
      {uploadModalVisible && (
        <div
          ref={modalRef}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70  justify-center items-center modal-overlay z-50 flex flex-col"
          onClick={() => handleModalClick()}
        >
          <ImagePreview previewUrl={imagePreview} />
          <div className="mt-[22px]">
            <button
              className="btn_outline_black !w-[75px] !h-[40px]  !text-[14px] "
              onClick={() => closePreviewModal()}
            >
              iptal
            </button>
            <button
              className="btn_primary !w-[75px] !h-[40px] !text-[14px] ml-[16px] "
              onClick={() => sendImagePreview()}
            >
              Gönder
            </button>
          </div>
        </div>
      )}
      <div className="flex">
        <div
          className={`w-[536px] rounded-[32px] h-[676px] bg-[#1A1A1A] pt-[32px] relative max-sm:!w-[420px] max-[450px]:!w-[320px] max-[450px]:!h-[685px]  ${
            props.chatType === "Ticket" ? "mb-[50px] !h-[640px]" : ""
          }`}
        >
          <div className="flex justify-between border-b border-solid border-gray-700 px-9 pb-[22px] ">
            {props.chatType === "Ticket" ? (
              <div className="dmsans70016 uppercase">
                #{props.chat?.ticket_number}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <img
                    className="rounded-full object-cover !w-[28px] !h-[28px]"
                    src={reciever?.photo}
                    // width={28}
                    // height={28}
                    alt="User Image"
                  />
                  <p className="text-white dmsans40014">{transporter?.name}</p>
                </div>
                {/* <Image
                  src={MoreSVG}
                  alt="User Image"
                  width={20}
                  height={20}
                ></Image> */}
              </>
            )}
          </div>
          {/* chat */}
          <div
            className={`  ${
              props.chatType == "Ticket" ? "!h-[470px]" : ""
            }    `}
          >
            {props.chatType === "Ticket" ? null : (
              <div
                onClick={() => Router.push(`/dashboard/offer/${offer._id}`)}
                className="flex cursor-pointer justify-between text-start border-b border-solid border-gray-700 px-9 py-[16px]"
              >
                <div>
                  <div className=" dmsans40014">
                    {offer?.description?.slice(0, 45) ||
                      "Profesyonel nakliye hizmeti için bize ulaşın"}
                    ...
                  </div>
                  <p className="dmsans40014 opacity-50 mt-1">
                    {`${offer?.from_where} > ${offer?.to_where}`} •{" "}
                    {offer?.price} TL
                  </p>
                </div>
                <Image
                  src={ArrowRightSvg}
                  className="cursor-pointer"
                  alt="User Image"
                  width={16}
                  height={16}
                ></Image>
              </div>
            )}
            <div
              ref={messagesContainerRef}
              className={`  ${
                props.chatType == "Ticket" ? "h-full" : "!h-[370px]"
              }   overflow-auto pt-[16px] flex flex-col px-9 `}
            >
              {messages.map((message, index) => (
                <React.Fragment key={index}>
                  <div
                    className={`px-4 py-3 rounded-2xl dmsans40016 max-w-[48%] ${
                      sender._id == message.from
                        ? "border border-solid border-gray-700  !bg-[#2C2C2C]  bg-gradient-to-b from-[#222222] to-[#2C2C2C] self-end "
                        : "bg-gradient-to-b from-red-600 via-red-500 to-red-800 text-left"
                    } ${message?.media_url ? "cursor-pointer" : ""}`}
                    onClick={() => {
                      if (message?.media_url) {
                        openImageModal(message?.media_url)
                      }
                    }}
                  >
                    {message?.media_url ? (
                      <>
                        <img
                          ref={scroll}
                          className="rounded-2xl object-cover  cursor-pointer w-full"
                          src={message?.media_url}
                          alt={`\nDosyayı önizlemek için tıklayın`}
                        />
                      </>
                    ) : (
                      <>
                        <p ref={scroll} className="dmsans40012  ">
                          {message.message}
                        </p>
                      </>
                    )}
                  </div>
                  <div
                    className={`mb-[20px]  ${
                      sender?._id == message?.from ? " self-end " : " text-left"
                    }`}
                  >
                    {TimestampComponent(message.message_at)}
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div>
              {props.chatType === "Ticket" ? null : (
                <NewOfferChatCard sender={sender} chat={conversation} />
              )}
            </div>
          </div>
          {/* messages bar */}
          <div className="absolute bottom-[12px]  max-sm:!w-[420px] max-[450px]:!w-[320px] ">
            <div className="px-9 mt-[14px]    max-sm:!mt-[0px]      flex justify-center">
              <form
                onSubmit={(e) => handleSendMessage(e)}
                className="flex justify-between  items-center  max-sm:!w-full"
              >
                <input
                  type="file"
                  accept="image/*, .pdf, .txt"
                  onChange={(e) => handleImageChange(e)}
                  className="sr-only "
                  id="imageInput"
                />
                <label
                  htmlFor="imageInput"
                  className="cursor-pointer max-[450px]:!w-[20px]"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.2" clip-path="url(#clip0_278_4938)">
                      <path
                        d="M22.1513 3.75L20.385 1.46C20.0332 1.00726 19.5829 0.640521 19.0683 0.387568C18.5538 0.134614 17.9884 0.0020788 17.415 0L12.585 0C12.0116 0.0020788 11.4462 0.134614 10.9317 0.387568C10.4171 0.640521 9.96684 1.00726 9.61501 1.46L7.84875 3.75H22.1513Z"
                        fill="white"
                      />
                      <path
                        d="M15 22.5C17.7614 22.5 20 20.2614 20 17.5C20 14.7386 17.7614 12.5 15 12.5C12.2386 12.5 10 14.7386 10 17.5C10 20.2614 12.2386 22.5 15 22.5Z"
                        fill="white"
                      />
                      <path
                        d="M23.75 6.25H6.25C4.59301 6.25198 3.00445 6.9111 1.83277 8.08277C0.661102 9.25445 0.00198482 10.843 0 12.5L0 23.75C0.00198482 25.407 0.661102 26.9956 1.83277 28.1672C3.00445 29.3389 4.59301 29.998 6.25 30H23.75C25.407 29.998 26.9956 29.3389 28.1672 28.1672C29.3389 26.9956 29.998 25.407 30 23.75V12.5C29.998 10.843 29.3389 9.25445 28.1672 8.08277C26.9956 6.9111 25.407 6.25198 23.75 6.25ZM15 25C13.5166 25 12.0666 24.5601 10.8332 23.736C9.59985 22.9119 8.63856 21.7406 8.0709 20.3701C7.50325 18.9997 7.35472 17.4917 7.64411 16.0368C7.9335 14.582 8.64781 13.2456 9.6967 12.1967C10.7456 11.1478 12.082 10.4335 13.5368 10.1441C14.9917 9.85472 16.4997 10.0032 17.8701 10.5709C19.2406 11.1386 20.4119 12.0999 21.236 13.3332C22.0601 14.5666 22.5 16.0166 22.5 17.5C22.498 19.4885 21.7072 21.395 20.3011 22.8011C18.895 24.2072 16.9885 24.998 15 25Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_278_4938">
                        <rect width="30" height="30" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </label>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="dmsans40014   max-sm:text-xs  bg-[#2C2C2C] rounded-[32px] w-[370px] h-[55px]  mr-[19px] px-[16px] py-[10px] ml-[16px] outline-none  max-sm:!w-[250px]   max-sm:!h-[45px] max-[450px]:!w-[150px]"
                  placeholder="Mesajınızı yazın..."
                />
                <button type="submit" className="max-[450px]:!w-[20px]">
                  <Image
                    src={paperPlaneSVG}
                    alt="send message icon"
                    width={24}
                    height={24}
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chat
