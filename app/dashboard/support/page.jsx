"use client"

import { useEffect, useState, useContext, useLayoutEffect } from "react"
import React from "react"
import Chat from "@/components/Chat"
import ChatInfoCard from "@/components/atoms/chatInfoCard"
import { useRouter } from "next/navigation"
import { UserContext } from "@/layout.jsx"
import TicketInfoCard from "@/components/atoms/ticketInfoCard"
const Support = (props) => {
  const router = useRouter()
  const { userState } = useContext(UserContext)

  const { conversationID } = props

  const [chatID, setChatID] = useState(conversationID)
  const [user, setUser] = useState({})
  const [tickets, setTickets] = useState({})
  const [allTickets, setAllTickets] = useState([])
  const [transporter, setTransporter] = useState({})
  const [allChats, setAllChats] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (userState.user) {
        const userDataObject = userState.user
        if (userDataObject) {
          setUser(userDataObject)
          try {
            const userData = await fetch(
              `${process.env.BASEURL}/support/list?user=${userDataObject._id}`
            )
            const userJson = await userData.json()
            setAllTickets(userJson.data)
          } catch (error) {
            console.error("Error fetching data:", error)
          }
        }
      }
    }

    fetchData()
  }, [userState])

  let ticket = allTickets.find((ticket) => ticket._id === chatID)

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
  useLayoutEffect(() => {
    if (userState?.user?.plan == null) {
      router.push("/payment")
    }
  }, [userState, userState?.user?.plan])
  return (
    <>
      <div className="flex justify-between w-screen px-8 lg:w-[900px] lg:px-0">
        <div className="w-full flex-grow justify-between flex">
          <h1 className="dmsans70024  self-end">Destek Talepleri</h1>{" "}
          <button
            onClick={() => router.push("/new_ticket")}
            className="btn_primary !w-[151px] !h-[30px] !rounded-lg"
          >
            Yeni Destek Talebi
          </button>
        </div>
      </div>
      {!allTickets ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="self-start">
          <div
            className=" flex flex-wrap justify-start items-start gap-[31px] max-[970px]:flex-col
        max-[970px]:items-center max-[970px]:mt-[2rem] mt-[23px] "
          >
            <div>
              {allChats ? (
                allTickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    className="mr-[31] cursor-pointer"
                    onClick={() => onChatSelect(ticket._id)}
                  >
                    <TicketInfoCard
                      ticket={ticket}
                      selected={ticket._id === chatID}
                    />
                  </div>
                ))
              ) : (
                <div>Yükleniyor...</div>
              )}
            </div>
            {ticket ? (
              <Chat
                chat={ticket._id === chatID ? ticket : null}
                chatType={"Ticket"}
                updateChatMessages={updateChatMessages}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Support
