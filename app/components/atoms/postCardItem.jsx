"use client"

import React from "react"
import Image from "next/image"
import StarSVG from "../../../public/assets/images/star.svg"
import { priceFormatHandler } from "../utilities/index"
import { useRouter } from "next/router"
import truncateDescription from "../utilities/index"

const postCardItem = (probs) => {
  const listing = probs.listing ? probs.listing : probs.post
  function calculateRating(listing) {
    if (
      listing?.total_rating !== undefined &&
      listing?.total_rating_count !== undefined
    ) {
      if (
        listing.total_rating !== null &&
        listing.total_rating_count !== null
      ) {
        return `${listing.total_rating} (${listing.total_rating_count})`
      } else {
        return `0 (${listing.total_rating_count})`
      }
    } else {
      return "(0)"
    }
  }

  return (
    <div className="w-[170px] h-[273px] cursor-pointer  ">
      <img
        src={listing?.image}
        alt="Post"
        className=" rounded-2xl w-[170px] h-[160px] object-cover"
      />
      <div className="mt-4 ">
        <div className="flex justify-start align-baseline ">
          <div className="border border-solid border-[#414141] rounded-[32px] w-[79px] h-[28px]     ">
            <p className="dmsans40012 py-[6px] text-center">
              {listing?.price === 0
                ? "Teklif iste"
                : priceFormatHandler(listing?.price) + " TL"}
            </p>
          </div>
          <div className="border border-solid border-[#414141] rounded-[32px] w-[85px] h-[28px] dmsans4001114 gap-2 flex justify-center align-baseline items-center  ml-[6px]">
            <Image src={StarSVG} width={12} alt="Star" />
            <p className="dmsans4001114">{calculateRating(listing)}</p>
          </div>
        </div>
        <div className="mt-[10px]">
          <p className="dmsans50014 text-[14px]">
            {truncateDescription(listing?.title, 55)}
          </p>
          <p className="dmsans40013 opacity-50 mt-[6px]">
            {listing?.from_where}
            {" > "}
            {listing?.to_where}
          </p>
        </div>
      </div>
    </div>
  )
}

export default postCardItem
