"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import backBtnIcon from "../../public/assets/images/backArrow-right.svg";
import FooterPartial from "../components/FooterPartial";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/tr";
import React, { useLayoutEffect, useContext } from "react";
import { redirect } from "next/navigation";
import { UserContext } from "@/layout.jsx";
import { AuthContext } from "@/components/utilities";
export default function RootLayout({ children }) {
  const { currentUser } = useContext(AuthContext);
  const { userState, setUserState } = useContext(UserContext);
  const router = useRouter();
  useLayoutEffect(() => {
    if (currentUser == null) {
      redirect("/");
    } else if (!userState) {
      if (localStorage.getItem("user") === null) {
        alert("Yeniden giriş yapmanız gerekmektedir");
        auth.signOut();
        redirect("/");
      }
      setUserState(JSON.parse(localStorage.getItem("user")));
    }
  });

  const handleBackClick = () => {
    router.back();
  };

  useLayoutEffect(() => {
    if (currentUser == null) {
      redirect("/");
    }
  });

  return (
    <>
      <div className="flex flex-row justify-center">
        <div className="pt-16">
          <button
            className="items-center flex justify-center  border border-solid border-gray-700 w-[42px] h-[42px] rounded-full bg-[#343434] "
            onClick={handleBackClick}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.5">
                <path
                  d="M7.9751 15.0583L2.91676 9.99999L7.9751 4.94165"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.0833 10L3.05825 10"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </button>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
            {children}
          </LocalizationProvider>
        </div>
      </div>
      <footer className="border-t justify-evenly items-between md:items-start dmsans border-solid border-[#2C2C2C] py-[36px] rounded-b-2xl flex flex-col sm:flex-row md:flex-row items-center space-y-12 md:space-y-0 md:justify-start sm:pl-[2rem] text-[18px] md:text-[16px] md:space-x-[3rem] lg:space-x-[9rem] font-[400] leading-[21px] footer_t1 mb-10">
        <FooterPartial />
      </footer>
    </>
  );
}
