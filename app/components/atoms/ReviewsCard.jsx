"use client"
import React, { useEffect, useContext, useState } from "react"
import Image from "next/image"
import userImage from "../../../public/assets/images/userImage.png"
import StarRating from "./StarRating"
import dayjs from "dayjs"

const ReviewsCard = (props) => {
  const { comment, rating, created_at } = props?.review
  const [data, setData] = useState({})

  useEffect(() => {
    if (props.review.user?._id) {
      fetch(`${process.env.BASEURL}/user/get?user=${props?.review?.user?._id}`)
        .then((response) => response.json())
        .then((json) => setData(json.data))
    }
  }, [props.review.user?._id])

  const maxDescriptionLength = 97
  const truncatedDescription =
    comment?.length > maxDescriptionLength
      ? comment.slice(0, maxDescriptionLength) + "..."
      : comment

  const date = new Date(created_at)

  const day = date.getDate()
  const monthIndex = date.getMonth()
  const year = date.getFullYear()
  const hour = date.getHours()
  const minute = date.getMinutes()

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

  const formattedDate = `${day} ${monthNames[monthIndex]} ${year}, ${hour}:${minute}`

  return (
    <div className="    w-[390px] h-[130px] py-[16px] px-[20px] bg-[#1C1C1C] rounded-2xl">
      <div className=" flex justify-between ">
        <div className="flex gap-[15px] ">
          <img
            src={props?.review?.user?.photo || userImage}
            // width={40}
            // height={40}
            alt="User Image"
            className="rounded-full w-[40px] h-[40px]"
          />
          <div>
            <div className=" flex gap-1">
              <StarRating reviewRate={rating} />
            </div>
            <p className="dmsans70016 text-[16px] mt-1">{data?.name}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <p className="dmsans40012 text-[12px] opacity-50">{formattedDate}</p>
        </div>
      </div>

      <div className="mt-[10px]">
        <p className="dmsans50014 text-[14px] opacity-50">
          {truncatedDescription}
        </p>
      </div>
    </div>
  )
}

export default ReviewsCard
