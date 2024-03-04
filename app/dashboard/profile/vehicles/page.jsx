"use client"

import { useLayoutEffect, useState, useContext } from "react"
import { useRouter } from "next/navigation"
import React from "react"
import Vehicle from "../../../components/Vehicle"
import { UserContext } from "@/layout.jsx"

const Vehicles = () => {
  const router = useRouter()
  const [data, setData] = useState([])
  const { userState, setUserState } = useContext(UserContext)
  const [transporterID, setTransporterID] = useState("")
  const userID = userState?.user?._id

  const getVehiclesByTransporterID = async () => {
    if (userState?.user?.role === "TRANSPORTER") {
      await fetch(`${process.env.BASEURL}/transporter/get?user=${userID}`)
        .then((data) => data.json())
        .then((json) => setTransporterID(json?.data?._id))
      await fetch(
        `${process.env.BASEURL}/vehicle/list?transporter=${transporterID}`
      )
        .then((response) => response.json())
        .then((json) => setData(json?.data))
    }
  }

  useLayoutEffect(() => {
    if (userState?.user?.role !== "TRANSPORTER") {
      router.push("/dashboard")
    }
    if (userState?.user?.plan == null) {
      router.push("/payment")
    }
    getVehiclesByTransporterID()
  }, [userID, transporterID])
  return (
    <div className="mx-auto">
      <h1 className="mb-[24px] dmsans70024">Araçlarım</h1>
      <div className="flex flex-row  flex-wrap justify-start items-center gap-[21px]">
        {data?.length > 0 ? (
          data?.map((data) => <Vehicle key={data.id} vehicle={data} />)
        ) : (
          <p className="opacity-50 initial-0">Gösterilecek bir şey yok</p>
        )}
      </div>
    </div>
  )
}

export default Vehicles
