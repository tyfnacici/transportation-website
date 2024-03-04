"use client";
import { redirect } from "next/navigation"
import BackButton from "@/components/atoms/BackButton"
import FooterPartial from "../components/FooterPartial"
import { AuthContext } from "@/components/utilities"
import { useLayoutEffect, useContext } from "react"

export default function RootLayout({ children }) {
  const { currentUser } = useContext(AuthContext)

  useLayoutEffect(() => {
    if (currentUser == null) {
      redirect("/")
    }
  })

  return (
    <>
      <div className="flex flex-row">
        <div className="pt-16 !w-full pl-[24px] lg:pl-0 relative">
          <BackButton fixed={false} />
          <div className="mt-[52px] mb-[136px]">{children}</div>
        </div>
      </div>
      <footer className="border-t justify-evenly items-between md:items-start dmsans border-solid border-[#2C2C2C] py-[36px] rounded-b-2xl flex flex-col sm:flex-row md:flex-row items-center space-y-12 md:space-y-0 md:justify-start sm:pl-[2rem] text-[18px] md:text-[16px] md:space-x-[3rem] lg:space-x-[9rem] font-[400] leading-[21px] footer_t1 mb-10">
        <FooterPartial />
      </footer>
    </>
  )
}
