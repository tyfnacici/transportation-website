"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import DollarSVG from "../../public/assets/images/dollar-circle.svg"
import TripSVG from "../../public/assets/images/offerTrip.svg"
import truncateDescription from "./utilities"
const OfferCard = (props) => {
  const [disabled, setDisabled] = useState(true)

  const imgSource = props?.listing?.image
  const offerDesc = props?.listing?.description
  const destinationFromWhere = props?.listing?.from_where
  const destinationToWhere = props?.listing?.to_where
  const price = props?.price

  const checkApproval = () => {
    if (props?.is_approved === true) {
      setDisabled(false)
    }
  }

  // Image, offer desc, destinationFromWhere, destinationToWhere, price

  useEffect(() => {
    checkApproval()
  }, [])

  return (
    <div className="bg-[#1C1C1C] rounded-2xl  w-[397px]  h-[190px] pt-6 pl-6 pb-[26px]">
      <div
        // onClick={redirect("/chat")}
        className="w-full flex flex-row  gap-4 justify-start items-start cursor-pointer "
      >
        <div className="min-w-[42px] bg-slate-800 rounded-lg">
          <img src={imgSource} width={42} height={42} alt="offerIMG" />
        </div>
        <div className="w-[275px]">
          <p className="dmsans40016 text-white ">
            {offerDesc
              ? truncateDescription(offerDesc, 70)
              : "Profesyonel nakliye hizmetleriniz için sizin yanınızdayız"}
          </p>
          <div className="flex justify-between gap-1 mt-2 max-w-[275px]">
            <div className="flex flex-col  gap-1">
              <p className="dmsans40012 opacity-50">Nereden</p>
              <div>
                <p className="dmsans40014">
                  {destinationFromWhere ? destinationFromWhere : "Ankara"}
                </p>
              </div>
            </div>
            <div className="mx-[8px] self-end  pb-[10px]">
              <Image src={TripSVG} width={34} height={4} alt="tripSVG" />
            </div>
            <div className="flex flex-col  gap-1 mr-5">
              <p className="dmsans40012 opacity-50">Nereye</p>
              <div>
                <p className="dmsans40014">
                  {destinationToWhere ? destinationToWhere : "Istanbul"}
                </p>
              </div>
            </div>
            <div className="flex flex-col  gap-1">
              <div className="flex gap-1  ">
                <Image src={DollarSVG} width={12} alt="DollarSVG" />
                <p className="dmsans40012 opacity-50">Fiyat</p>
              </div>
              <div className="min-w-[25px]">
                <p className="dmsans40014 ">{price ? price : "14.500"} TL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center gap-[20px] mt-[20px] mr-[23px]">
        <p
          disabled={disabled}
          className={` ${
            disabled ? "text-white opacity-50" : "text-[#9CFF38]"
          } dmsans40014`}
        >
          {disabled ? "Onay bekliyor" : "Onaylandı"}
        </p>
        <button className="btn_primary  !max-h-[32px] dmsans50013 !max-w-[70px]">
          İncele
        </button>
      </div>
    </div>
  )
}

export default OfferCard
