"use client"
import React, { useEffect } from "react"
import { formatDate } from "../utilities"

const TicketInfoCard = ({ selected, ticket }) => {
  if (!ticket) {
    return <div>Loading...</div>
  }
  const { ticket_number, updated_at, is_resolved, type } = ticket

  return (
    <div className="relative cursor-pointer">
      {selected && (
        <div className="bg-[#FF6438] absolute left-[-16px] mt-2 mr-4 z-50 w-[4px] h-[40px] rounded-[32px]  top-[43%] transform -translate-y-1/2 " />
      )}
      <div className=" border-b border-solid relative  border-gray-800 w-[337.01px]  py-[20px]">
        <p>
          <span className="text-white opacity-50">Talep: </span>{" "}
          <span className="text-white">{type}</span>
        </p>
        <p>
          <span className="text-white opacity-50">Tarih: </span>{" "}
          <span className="text-white">{formatDate(updated_at)}</span>
        </p>
        <p>
          <span className="text-white opacity-50 ">Talep no:</span>{" "}
          <span className="text-white uppercase ">#{ticket_number}</span>
        </p>
        <p>
          <span className="text-white opacity-50">Durum:</span>{" "}
          <span
            className={` text-[14px] ${
              is_resolved ? "text-[#52FF00]" : "text-[#FF6438]"
            }`}
          >
            {is_resolved ? "Çözüldü" : "Yanit Bekliyor"}
          </span>
        </p>
      </div>
    </div>
  )
}

export default TicketInfoCard
