"use client"

import PostCardItem from "@/components/atoms/postCardItem"
import { useLayoutEffect, useState, useContext } from "react"
import { UserContext } from "@/layout"
import { useRouter } from "next/navigation"
import React from "react"

const Listings = () => {
  const router = useRouter()
  const [activeListings, setActiveListings] = useState([])
  const [passiveListings, setPassiveListings] = useState([])
  const { userState, setUserState } = useContext(UserContext)
  const [transporterID, setTransporterID] = useState("")
  const userID = userState?.user?._id

  const getActiveAndPassiveListingsByTransporterID = async () => {
    if (userState?.user?.role === "TRANSPORTER") {
      await fetch(`${process.env.BASEURL}/transporter/get?user=${userID}`)
        .then((data) => data.json())
        .then((json) => setTransporterID(json?.data?._id))
      await fetch(
        `${process.env.BASEURL}/transporter/get-active-listings?transporter=${transporterID}`
      )
        .then((response) => response.json())
        .then((json) => setActiveListings(json?.data))

      await fetch(
        `${process.env.BASEURL}/transporter/get-passive-listings?transporter=${transporterID}`
      )
        .then((response) => response.json())
        .then((json) => setPassiveListings(json?.data))
    }
  }

  useLayoutEffect(() => {
    if (userState?.user?.role !== "TRANSPORTER") {
      router.push("/dashboard")
    }
    if (userState?.user?.plan == null) {
      router.push("/payment")
    }
    getActiveAndPassiveListingsByTransporterID()
  }, [userID, transporterID])
  return (
    <div className="mx-auto w-full">
      <h1 className="mb-[36px] dmsans70024">İlanlarım</h1>
      <div className="flex gap-[36px] flex-wrap">
        <div className="flex flex-col flex-grow w-[355px] flex-wrap justify-start items-center">
          <div className="border-b-[2px] w-full max-h-[50px] flex-grow opacity-50 py-[16px] text-center">
            <p>Açık İlanlar</p>
          </div>
          <div className="flex flex-wrap gap-x-[15px] gap-y-[20px] pt-[24px]">
            {activeListings?.length > 0 ? (
              activeListings?.map((post) => (
                <PostCardItem key={post.id} post={post} />
              ))
            ) : (
              <p className="opacity-50 initial-0">Gösterilecek bir şey yok</p>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-grow w-[355px] flex-wrap justify-start items-center">
          <div className="border-b-[2px] w-full max-h-[50px] flex-grow opacity-50 py-[16px] text-center">
            <p>Pasif İlanlar</p>
          </div>
          <div className="flex flex-wrap gap-x-[15px] gap-y-[20px] pt-[24px]">
            {passiveListings?.length > 0 ? (
              passiveListings?.map((post) => (
                <PostCardItem key={post.id} post={post} />
              ))
            ) : (
              <p className="opacity-50 initial-0">Gösterilecek bir şey yok</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Listings
