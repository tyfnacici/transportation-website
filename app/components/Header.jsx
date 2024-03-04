"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { signIn, signUp, useSession, getProviders } from "next-auth/react"
import { redirect } from "next/dist/server/api-utils"
import googleSVG from "../../public/assets/images/google.svg"
import appleSVG from "../../public/assets/images/apple.svg"
import headerICON from "../../public/assets/images/truck.svg"
import logo from "../../public/assets/images/logo.png"
import menuICON from "../../public/assets/images/menu.svg"

const Header = (props) => {
  const path = usePathname()

  const { menuState, setMenuState } = props

  const mobileNavigationHandler = () => {
    if (!menuState) {
      setMenuState(true)
    } else {
      setMenuState(false)
    }
  }

  return (
    <header className="bg-[#141414] fixed z-50 top-0 mx-auto w-screen pl-6 pr-2 lg:px-0 lg:container lg:pr-[4rem]">
      <nav className="flex justify-between items-center py-[1rem] ">
        {path === "/" ? (
          <Link href="/dashboard">
            <Image
              src={logo}
              width={170}
              className="ml-12 max-[572px]:ml-0"
              alt="header-icon"
            />
          </Link>
        ) : (
          <Link href="/dashboard">
            <Image src={logo} width={170} className="ml-12" alt="header-icon" />
          </Link>
        )}
        <div className="flex gap-x-4 max-[450px]:gap-x-0 max-[450px]:justify-end ">
          {path === "/" ? (
            <>
              <a
                className="header_button visible lg:invisible relative lg:absolute"
                href="https://play.google.com/store/games?device=windows"
              >
                <Image src={googleSVG} alt="google" />
                <div className="header_content">
                  <div className="header_t1 dmsans">Şimdi yükle</div>
                  <div className="header_t2 dmsans">Google Play</div>
                </div>
              </a>
              <a
                className="header_button !w-[8.875rem] visible lg:invisible relative lg:absolute"
                href="https://www.apple.com/tr/"
              >
                <Image src={appleSVG} alt="apple" />
                <div>
                  <div className="header_t1 dmsans">Şimdi yükle</div>
                  <div className="header_t2 dmsans">App Store</div>
                </div>
              </a>
            </>
          ) : (
            <button
              className="opacity-50 transition active:bg-[#222222] px-4 py-2 rounded-lg visible relative lg:absolute lg:invisible"
              onClick={mobileNavigationHandler}
            >
              <Image src={menuICON} alt="hamburger-menu" />
            </button>
          )}
          <a
            className="header_button invisible lg:visible absolute lg:relative"
            href="https://play.google.com/store/games?device=windows"
          >
            <Image src={googleSVG} alt="google" />
            <div className="header_content">
              <div className="header_t1 dmsans">Şimdi yükle</div>
              <div className="header_t2 dmsans">Google Play</div>
            </div>
          </a>
          <a
            className="header_button !w-[8.875rem] invisible lg:visible absolute lg:relative"
            href="https://www.apple.com/tr/"
          >
            <Image src={appleSVG} alt="apple" />
            <div>
              <div className="header_t1 dmsans">Şimdi yükle</div>
              <div className="header_t2 dmsans">App Store</div>
            </div>
          </a>
        </div>
      </nav>
      {path !== "/" && !menuState ? (
        <div className="flex flex-col md:flex-row md:text-[14px] items-center justify-between text-[12px] gap-y-2 visible lg:invisible relative lg:absolute pb-4">
          <p className=" opacity-45">
            Daha iyi bir deneyim için uygulamayı indir
          </p>
          <div className="flex gap-x-4 pt-2">
            <a
              className="header_button"
              href="https://play.google.com/store/games?device=windows"
            >
              <Image src={googleSVG} alt="google" />
              <div className="header_content">
                <div className="header_t1 dmsans">Şimdi yükle</div>
                <div className="header_t2 dmsans">Google Play</div>
              </div>
            </a>
            <a
              className="header_button !w-[8.875rem]"
              href="https://www.apple.com/tr/"
            >
              <Image src={appleSVG} alt="apple" />
              <div>
                <div className="header_t1 dmsans">Şimdi yükle</div>
                <div className="header_t2 dmsans">App Store</div>
              </div>
            </a>
          </div>
        </div>
      ) : (
        ""
      )}
    </header>
  )
}

export default Header
