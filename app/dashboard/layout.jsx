"use client"

import { PageContext } from "@/layout"
import SideNavigation from "../components/SideNavigation"
import FooterPartial from "../components/FooterPartial"
import React, { useLayoutEffect, useContext, useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { AuthContext } from "@/components/utilities"
import { UserContext } from "@/layout.jsx"
import auth from "../firebase/firebase-config"
import { usePathname } from "next/navigation"

export default function RootLayout({ children }) {
  const { menuState, setMenuState } = useContext(PageContext)
  const pathname = usePathname()
  const { currentUser } = useContext(AuthContext)
  const { userState, setUserState } = useContext(UserContext)

  useLayoutEffect(() => {
    setMenuState(false)
    if (currentUser == null) {
      redirect("/")
    } else if (!userState) {
      if (localStorage.getItem("user") === null) {
        alert("Yeniden giriş yapmanız gerekmektedir")
        auth.signOut()
        redirect("/")
      }
      setUserState(JSON.parse(localStorage.getItem("user")))
    }
  }, [pathname])
  return (
    <>
      <div
        className={`${
          menuState ? "bg-[#141414]" : "bg-none"
        } w-screen flex flex-col lg:flex-row items-center lg:items-start `}
      >
        <div
          className={`${
            menuState ? "visible z-40 static" : "invisible fixed lg:static"
          }`}
        >
          <SideNavigation menuState={menuState} setMenuState={setMenuState} />
        </div>
        <div
          className={`${
            menuState
              ? "invisible fixed z-0"
              : "pt-32 md:pt-[6rem] lg:pt-14 min-h-screen min-w-screen mx-6 flex flex-col items-center z-20 lg:mx-0 static"
          }`}
        >
          {children}
        </div>
      </div>
      <footer className="border-t justify-evenly items-between md:items-start dmsans border-solid border-[#2C2C2C] py-[36px] rounded-b-2xl flex flex-col sm:flex-row md:flex-row items-center space-y-12 md:space-y-0 md:justify-start sm:pl-[2rem] text-[18px] md:text-[16px] md:space-x-[3rem] lg:space-x-[9rem] font-[400] leading-[21px] footer_t1 mb-10">
        <FooterPartial />
      </footer>
    </>
  )
}
