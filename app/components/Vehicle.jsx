"use client"
import { comment } from "postcss"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import image from "../../public/assets/images/offerImage.png"

const Vehicle = (props) => {
    var {
      _id,
      transporter,
      type,
      plate_number,
      max_load,
      interior_photo,
      exterior_photo,
    } = props.vehicle

    interior_photo = image
    exterior_photo = image

    return (
      <div className="flex gap-x-[16px] pl-[20px] pt-[22px] pr-[24px] pb-[21px] bg-[#1C1C1C] rounded-[16px]">
        {/* Image section */}
        <div className="flex gap-x-[6px]">
          <Image
            src={interior_photo}
            alt="Vehicle"
            className="rounded-[8px] w-[72px] h-[72px]"
          />
          <Image
            src={exterior_photo}
            alt="Vehicle"
            className="rounded-[8px] w-[72px] h-[72px]"
          />
        </div>
        {/* Text section */}
        <div className="flex flex-col justify-center gap-y-[4px] items-start text-[14px] font-[400] leading-[18.23px]">
          {/* Text line */}
          <div className="space-x-1 flex">
            <p className="opacity-50">Tır Tipi:</p>
            <p>{type}</p>
          </div>
          <div className="space-x-1 flex">
            <p className="opacity-50">Plaka:</p>
            <p>{plate_number}</p>
          </div>
          <div className="space-x-1 flex">
            <p className="opacity-50">Yük kapasitesi:</p>
            <p>{max_load} Ton</p>
          </div>
        </div>
      </div>
    )
}

export default Vehicle
