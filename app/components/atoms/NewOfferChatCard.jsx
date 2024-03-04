"use client"
import React, { useEffect, useState, useContext } from "react"
import { useRouter } from "next/navigation"
import { UserContext } from "@/layout.jsx"

import { formatDate } from "@/components/utilities/index"

const NewOfferChatCard = (props) => {
  const { chat, sender } = props
  const router = useRouter()

  return (
    <>
      {chat?.offer ? (
        <div className="flex justify-between items-center bg-black border-t border-b border-[#2C2C2C] border-solid px-[36px] py-3">
          <div className="dmsans40016">
            <p>
              Son teklif:
              <span className="text-[#FF6438] ml-1">
                {chat?.offer?.price} TL
              </span>
            </p>
            <p className="dmsans40012 opacity-50">
              {formatDate(chat?.created_at)}
            </p>
          </div>
          <div>
            <button
              onClick={() => {
                router.push(`/edit_offer/${chat?.offer?._id}`)
              }}
              className="border border-solid border-gray-700 dmsans50014 bg-gradient-to-b from-[#222222] to-[#2C2C2C] rounded-lg bg-[#2C2C2C] !h-[30px] !px-[10px]"
            >
              İncele
            </button>

            <button
              onClick={() => {
                router.push(`/new_offer/${chat?._id}`)
              }}
              className="btn_primary !w-[84px] !h-[30px] !rounded-lg px-[10px] py-[6px] dmsans50014 ml-2 text-[14px]"
            >
              Yeni teklif
            </button>
          </div>
        </div>
      ) : (
        <>
          {sender?.role === "CUSTOMER" ? null : (
            <div className="flex justify-center w-full">
              <button
                onClick={() => {
                  router.push(`/new_offer/${chat?._id}`)
                }}
                className="btn_primary !w-[320px] !h-[30px] !rounded-lg px-[10px] py-[6px] dmsans50014 ml-2 text-[14px] "
              >
                Teklif oluştur
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default NewOfferChatCard
