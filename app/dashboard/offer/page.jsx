"use client"

import { useEffect, useState, useContext, useLayoutEffect } from "react"
import { useRouter } from "next/navigation"
import React from "react"
import OfferCard from "@/components/OfferCard.jsx"
import { UserContext } from "@/layout.jsx"

const Offer = () => {
  const [data, setData] = useState([])
  const router = useRouter()
  const { userState, setUserState } = useContext(UserContext)
  const [transporterID, setTransporterID] = useState("")
  const userID = userState.user?._id

  const redirectHandler = (url) => {
    router.push(`/edit_offer/${url}`)
  }

  const getOfferList = async () => {
    if (userState?.user?.role === "TRANSPORTER") {
      await fetch(`${process.env.BASEURL}/transporter/get?user=${userID}`)
        .then((data) => data.json())
        .then((json) => setTransporterID(json?._id))
      await fetch(
        `${process.env.BASEURL}/offer/list?transporter=${transporterID}&user=${userID}`
      )
        .then((response) => response.json())
        .then((json) => setData(json))
    } else {
      await fetch(`${process.env.BASEURL}/offer/list?user=${userID}`)
        .then((data) => data.json())
        .then((json) => setData(json?.data))
    }
  }

  useEffect(() => {
    getOfferList()
  }, [userState, transporterID])

  useLayoutEffect(() => {
    if (userState?.user?.plan == null) {
      router.push("/payment")
    }
  }, [userState, userState?.user?.plan])
  return (
    <div className="mx-auto">
      <h1 className="mb-[24px] dmsans70024">Teklifler</h1>
      <div className="flex flex-row  flex-wrap justify-start items-center gap-[21px]">
        {data?.length > 0 ? (
          data?.map((offer) => (
            <div key={offer.id} onClick={() => redirectHandler(offer?._id)}>
              <OfferCard {...offer} />
            </div>
          ))
        ) : (
          <p className="opacity-50 initial-0">Gösterilecek bir şey yok.</p>
        )}
      </div>
    </div>
  )
}

export default Offer
