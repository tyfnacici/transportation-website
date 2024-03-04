"use client"

import { useEffect, useState, useContext, useLayoutEffect } from "react"
import React from "react"
import Chat from "@/components/Chat"
import ChatInfoCard from "@/components/atoms/chatInfoCard"
import { UserContext } from "@/layout.jsx"
import { useRouter } from "next/navigation"
import { Message } from "primereact/message"

const Messages = (props) => {
  const router = useRouter()
  const { userState } = useContext(UserContext)

  const conversationID = props.params.conversation

  const [chatID, setChatID] = useState(conversationID)
  const [user, setUser] = useState({})
  const [transporter, setTransporter] = useState({})
  const [allChats, setAllChats] = useState([])

  useLayoutEffect(() => {
    if (userState?.user?.plan == null) {
      router.push("/payment")
    }
  }, [userState, userState?.user?.plan])
  useEffect(() => {
    const fetchData = async () => {
      if (userState.user) {
        const userDataObject = userState.user
        if (userDataObject.role === "CUSTOMER") {
          setUser(userDataObject)
          try {
            const userData = await fetch(
              `${process.env.BASEURL}/user/get?user=${userDataObject._id}`
            )
            const userJson = await userData.json()

            setUser(userJson.data)

            const chatListData = await fetch(
              `${process.env.BASEURL}/chat/list?user=${userJson.data._id}`
            )
            const chatListJson = await chatListData.json()

            setAllChats(chatListJson.data)
          } catch (error) {
            console.error("Error fetching data:", error)
          }
        } else {
          setTransporter(userDataObject)
          try {
            const transporterData = await fetch(
              `${process.env.BASEURL}/transporter/get?user=${userDataObject._id}`
            )
            const transporterJson = await transporterData.json()

            setTransporter(transporterJson.data)

            const chatListData = await fetch(
              `${process.env.BASEURL}/chat/list?user=${transporterJson.data.user}&transporter=${transporterJson.data._id}`
            )
            const chatListJson = await chatListData.json()

            setAllChats(chatListJson.data)
          } catch (error) {
            console.error("Error fetching data:", error)
          }
        }
      }
    }

    fetchData()
  }, [userState])

  let chat = allChats.find((chat) => chat._id === chatID)
  const onChatSelect = (chatID) => {
    setChatID(chatID)
  }

  const updateChatMessages = (updatedChatID, newMessage) => {
    setAllChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === updatedChatID
          ? { ...chat, last_message: newMessage }
          : chat
      )
    )
  }

  return (
    <>
      {!allChats ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="mb-[54px]">
          <h1 className="dmsans70024 ">Mesajlar</h1>
          <div className="flex flex-wrap justify-start items-start gap-[31px] max-[970px]:flex-col max-[970px]:items-center max-[970px]:mt-[2rem]    ">
            <div className="flex flex-col">
              {allChats?.length > 0 ? (
                allChats.map((chat) => (
                  <div
                    key={chat._id}
                    className=" flex flex-col cursor-pointer"
                    onClick={() => onChatSelect(chat._id)}
                  >
                    <ChatInfoCard
                      transporter={
                        userState.user?._id === chat.user?._id
                          ? chat.transporter
                          : chat.user
                      }
                      timestamp={chat.updated_at}
                      messages={chat.last_message}
                      listing={chat.listing}
                      selected={chat._id === chatID}
                    />
                  </div>
                ))
              ) : (
                <p className="opacity-50 initial-0">Yükleniyor..</p>
              )}
            </div>
            {chat ? (
              <Chat chat={chat} updateChatMessages={updateChatMessages} />
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Messages
