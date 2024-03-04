"use client";
import React, { useEffect, useContext } from "react"
import { redirect } from "next/navigation"
import CreateProfileCard from "@/components/CreateProfileCard"

const CreateProfilePage = () => {
  return (
    <>
      <div>
        <CreateProfileCard />
      </div>
    </>
  )
}

export default CreateProfilePage;
