"use client"
import React, { useState, useLayoutEffect, useContext } from "react"
import { useRouter } from "next/navigation"
import ReviewsCard from "@/components/atoms/ReviewsCard.jsx"
import { UserContext } from "@/layout.jsx"

const ReviewsPage = () => {
  const router = useRouter()
  const [data, setData] = useState([])
  const [transporterID, setTransporterID] = useState("")
  const { userState, setUserState } = useContext(UserContext)
  const userID = userState?.user?._id

  const getReviewsByTransporterID = async () => {
    if (userState?.user?.role === "TRANSPORTER") {
      await fetch(`${process.env.BASEURL}/transporter/get?user=${userID}`)
        .then((data) => data.json())
        .then((json) => setTransporterID(json?.data?._id))
      await fetch(
        `${process.env.BASEURL}/transporter/get-reviews?transporter=${transporterID}`
      )
        .then((response) => response.json())
        .then((json) => setData(json.data))
    }
  }

  useLayoutEffect(() => {
    if (userState?.user?.role !== "TRANSPORTER") {
      router.push("/dashboard")
    }
    if (userState?.user?.plan == null) {
      router.push("/payment")
    }
    getReviewsByTransporterID()
  }, [userState, transporterID])

  return (
    <div className="mx-auto">
      <h1 className="mb-[36px] dmsans70024">Değerlendirmelerim</h1>
      <div className="flex flex-row flex-wrap justify-start gap-[16px] items-center">
        {data?.length > 0 ? (
          data?.map((review) => (
            <ReviewsCard key={review._id} review={review} />
          ))
        ) : (
          <p className="opacity-50 initial-0">Gösterilecek bir şey yok</p>
        )}
      </div>
    </div>
  )
}

export default ReviewsPage
