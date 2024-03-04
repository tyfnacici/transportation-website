"use client"
import React from "react"
import Image from "next/image"
import userImage from "../../../public/assets/images/userImage.png"
import { formatDate } from "../utilities/index"

import truncateDescription from "../utilities"
const ChatInfoCard = (props) => {
  const { transporter, timestamp, messages, listing, selected } = props

  return (
    <div className="relative   cursor-pointer">
      {selected && (
        <div className="bg-[#FF6438] absolute top-[8px] left-[-16px] mt-2 mr-4 z-50 w-[4px] h-[40px] rounded-[32px]" />
      )}
      <div className="flex flex-row border-b border-solid relative border-gray-800 mt-[16px] w-[350px] ">
        <div className="relative bottom-1 left-0 !h-[48px] w-[48px] mr-4 mb-4">
          <img
            className=" rounded-lg object-cover !w-[48px] !h-[48px]"
            src={listing.image}
            alt="Picture of the user"
            // width={48}
            // height={48}
          ></img>
          <img
            src={transporter.photo}
            className="  absolute  !w-[24px]  object-cover !h-[24px] bottom-0  right-0 mr-[0.6rem] transform translate-x-1/2 translate-y-1/2  border border-solid border-white border-opacity-80 rounded-full"
            alt="Picture of the user"
            // width={24}
            // height={24}
          ></img>
        </div>
        <div>
          <div className="flex flex-col items-start justify-center">
            <p className="text-[14px] font-[400] leading-[21px]">
              {truncateDescription(
                listing.desription || "Profesyonel nakliye hizmeti",
                27
              )}
            </p>
            <div className="flex justify-center items-center space-x-1 text-[14px] font-[400] leading-[17px] mb-[4px]">
              <p className="text-[#FF6438]">{transporter.name}:</p>
              <p className="text-white opacity-50 ">
                {truncateDescription(messages, 30)}
              </p>
            </div>
          </div>
        </div>
        <p className="dmsans50012 absolute top-0 right-0 opacity-50 text-center ">
          {formatDate(timestamp)}
        </p>
      </div>
    </div>
  )
}

export default ChatInfoCard
