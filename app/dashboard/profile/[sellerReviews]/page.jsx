"use client"

import PostCardItem from "@/components/atoms/postCardItem"
import { useEffect, useState } from "react"
import React from "react"
import StarRating from "@/components/atoms/StarRating"
import Image from "next/image"
import ReviewsCard from "@/components/atoms/ReviewsCard.jsx"
import router from "next/navigation"
import BackButton from "@/components/atoms/BackButton"
import { useRouter } from "next/navigation"

const SellerReviews = (props) => {
  const [data, setData] = useState([])
  const [activeListings, setActiveListings] = useState([])
  const [transporterID, setTransporterID] = useState("")
  const [transporter, setTransporter] = useState({})
  const router = useRouter()
  const fetchTransporterReviews = async () => {
    try {
      await fetch(
        `${process.env.BASEURL}/transporter/get-reviews?transporter=${props.params.sellerReviews}`
      )
        .then((data) => data.json())
        .then((json) => setData(json.data))
    } catch (error) {
      console.error("Error fetching dummy data:", error)
      setData([])
    }
  }

  const fetchActiveListings = async () => {
    try {
      await fetch(
        `${process.env.BASEURL}/transporter/get-active-listings?transporter=${props.params.sellerReviews}`
      )
        .then((data) => data.json())
        .then((json) => {
          setActiveListings(json.data)
          setTransporterID(json?.data[0]?.transporter?.user)
        })
    } catch (error) {
      console.error("Error fetching dummy data:", error)
      setData([])
    }
  }

  const fetchTransporter = async () => {
    if (transporterID) {
      try {
        await fetch(
          `${process.env.BASEURL}/transporter/get?user=${transporterID}`
        )
          .then((data) => data.json())
          .then((json) => setTransporter(json.data))
      } catch (error) {
        console.error("Error fetching dummy data:", error)
        setData([])
      }
    }
  }

  const redirectHandler = (url) => {
    router.push(`/dashboard/offer/${url}`)
  }
  useEffect(() => {
    fetchTransporterReviews()
    fetchTransporter()
    fetchActiveListings()
  }, [transporterID])

  return (
    <>
      {!transporter?.photo ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="mx-auto w-full">
          <BackButton />
          <div className="mt-[36px]">
            <div className="mx-auto w-full items-center text-center ">
              <div className="flex justify-center ">
                <img
                  // width={72}
                  // height={72}
                  src={transporter?.photo || "/assets/images/user.png"}
                  alt="User Image"
                  className="rounded-full mb-[17px] w-[72px] h-[72px]  "
                />
              </div>

              <div className="text-[24px] font-normal">
                <span>{transporter?.name}</span>
              </div>
              <div className="mt-2 flex justify-center ">
                <StarRating
                  reviewRate={
                    transporter?.total_rating / transporter?.total_rating_count
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex gap-[63px] flex-wrap mb-[87px]">
            <div className=" justify-start items-center  w-[397px]  ">
              <div className="border-b-[2px] max-h-[50px] flex-grow opacity-50 py-[16px] text-center mb-6">
                <p>Değerlendirmeler</p>
              </div>
              <div className="bg-[#1C1C1C] pt-[5px] px-[5px] rounded-2xl">
                {data.map((review, index) => (
                  <div key={review._id}>
                    <ReviewsCard review={review} />
                    {index < data.length - 1 && (
                      <div className="w-[350px] mx-auto border-[#2C2C2C] border-b h-[1px]"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className=" justify-start items-center w-[355px]">
              <div className="border-b-[2px] max-h-[50px] flex-grow opacity-50 py-[16px] text-center">
                <p>Açık İlanlar</p>
              </div>
              <div className="flex flex-wrap  justify-center gap-x-[15px] gap-y-[20px] pt-[24px]">
                {activeListings ? (
                  activeListings.map((post) => (
                    <div
                      onClick={() => redirectHandler(post?._id)}
                      key={post?._id}
                    >
                      <PostCardItem post={post} />
                    </div>
                  ))
                ) : (
                  <div>Yükleniyor...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SellerReviews
