"use client";

import { DM_Sans } from "next/font/google";
const dmSansInit = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dmsans",
});
import "./globals.css";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import Header from "./components/Header";
import { useState, createContext } from "react";
import { AuthProvider } from "./components/utilities";

export const UserContext = createContext(false);
export const PageContext = createContext(false);

export default function RootLayout({ children }) {
  const [menuState, setMenuState] = useState(false);
  const [userState, setUserState] = useState(false);
  return (
    <html lang="en" className={`${dmSansInit.variable}`}>
      <head></head>
      <body
        className={`pt-[23px] text-white h-screen w-screen ld:w-full lg:container flex flex-col lg:mx-auto lg:px-[2rem] bg-[#141414] dmsans`}
      >
        <Header menuState={menuState} setMenuState={setMenuState} />
        <main className="justify-center mt-8">
          <PrimeReactProvider>
            <AuthProvider>
              <UserContext.Provider value={{ userState, setUserState }}>
                <PageContext.Provider value={{ menuState, setMenuState }}>
                  {children}
                </PageContext.Provider>
              </UserContext.Provider>
            </AuthProvider>
          </PrimeReactProvider>
        </main>
      </body>
    </html>
  )
}
