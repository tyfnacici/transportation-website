"use client"
import React, { useState, useEffect } from "react"
import ConfirmationCard from "./components/atoms/ConfirmationCard.jsx"
import FooterPartial from "./components/FooterPartial"
import Modal from "./components/atoms/Modal"

const Page = () => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isPhoneNumberError, setIsPhoneNumberError] = useState(false)
  const [isVisibleModal, setIsVisibleModal] = useState(false)
  const [prefixPhoneNumber, setPrefixPhoneNumber] = useState("")

  const handlePhoneNumberChange = (e) => {
    const formattedValue = e.target.value.replace(/\D/g, "")

    const slicedValue = formattedValue.slice(0, 10)

    setPhoneNumber(slicedValue)

    const isInvalid = slicedValue.length > 11

    setIsPhoneNumberError(isInvalid)
  }

  const handleVerification = () => {
    if (phoneNumber.trim() === "") {
      setIsPhoneNumberError(true)

      return
    } else {
      setPrefixPhoneNumber(`+90${phoneNumber}`)
      setIsVisibleModal(true)
    }
  }

  const closeModal = () => {
    setIsVisibleModal(false)
  }

  useEffect(() => {
    localStorage.removeItem("_grecaptcha")
  }, [])

  return (
    <>
      <Modal isVisible={isVisibleModal} onClose={closeModal}>
        <ConfirmationCard phoneNumber={prefixPhoneNumber} />
      </Modal>

      <div className="flex justify-between xl:flex-row  max-xl:flex-col  max-xl:items-center">
        <div className="text-[72px] font-[700] leading-[94px] mt-[4.5rem]  max-xl:text-center max-[450px]:text-[62px]">
          <span>
            <span className="text-[#FF6438]">YÜKÜNÜZ </span>
            YERDE KALMASIN
            <span className="text-[#FF6438]"> TEKERİNİZ </span>
          </span>
          <br />
          BOŞA DÖNMESİN
        </div>
        <div className="max-w-[24.875rem] rounded-2xl bg-[#1A1A1A] px-[1.875rem] pt-9 mt-[82px]">
          <div>
            <h4 className="text-[18px] font-[400] leading-[23px] text-white">
              Hoş geldiniz!
            </h4>
            <h6 className="mt-[8px] text-[14px] font-[400] leading-[18px] opacity-50">
              Lütfen numaranızı +90 ülke kodu olmadan giriniz. Örn: &quot;555
              XXX XX XX&quot;
            </h6>
          </div>
          <div className="relative w-[338px] h-[55px] rounded-full bg-[#222222] flex justify-start pl-[6px] mt-8">
            <div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-1/2 left-5 transform -translate-y-1/2"
              >
                <g opacity="0.5">
                  <path
                    d="M17.45 22.75C16.32 22.75 15.13 22.48 13.9 21.96C12.7 21.45 11.49 20.75 10.31 19.9C9.14 19.04 8.01 18.08 6.94 17.03C5.88 15.96 4.92 14.83 4.07 13.67C3.21 12.47 2.52 11.27 2.03 10.11C1.51 8.87 1.25 7.67 1.25 6.54C1.25 5.76 1.39 5.02 1.66 4.33C1.94 3.62 2.39 2.96 3 2.39C3.77 1.63 4.65 1.25 5.59 1.25C5.98 1.25 6.38 1.34 6.72 1.5C7.11 1.68 7.44 1.95 7.68 2.31L10 5.58C10.21 5.87 10.37 6.15 10.48 6.43C10.61 6.73 10.68 7.03 10.68 7.32C10.68 7.7 10.57 8.07 10.36 8.42C10.21 8.69 9.98 8.98 9.69 9.27L9.01 9.98C9.02 10.01 9.03 10.03 9.04 10.05C9.16 10.26 9.4 10.62 9.86 11.16C10.35 11.72 10.81 12.23 11.27 12.7C11.86 13.28 12.35 13.74 12.81 14.12C13.38 14.6 13.75 14.84 13.97 14.95L13.95 15L14.68 14.28C14.99 13.97 15.29 13.74 15.58 13.59C16.13 13.25 16.83 13.19 17.53 13.48C17.79 13.59 18.07 13.74 18.37 13.95L21.69 16.31C22.06 16.56 22.33 16.88 22.49 17.26C22.64 17.64 22.71 17.99 22.71 18.34C22.71 18.82 22.6 19.3 22.39 19.75C22.18 20.2 21.92 20.59 21.59 20.95C21.02 21.58 20.4 22.03 19.68 22.32C18.99 22.6 18.24 22.75 17.45 22.75ZM5.59 2.75C5.04 2.75 4.53 2.99 4.04 3.47C3.58 3.9 3.26 4.37 3.06 4.88C2.85 5.4 2.75 5.95 2.75 6.54C2.75 7.47 2.97 8.48 3.41 9.52C3.86 10.58 4.49 11.68 5.29 12.78C6.09 13.88 7 14.95 8 15.96C9 16.95 10.08 17.87 11.19 18.68C12.27 19.47 13.38 20.11 14.48 20.57C16.19 21.3 17.79 21.47 19.11 20.92C19.62 20.71 20.07 20.39 20.48 19.93C20.71 19.68 20.89 19.41 21.04 19.09C21.16 18.84 21.22 18.58 21.22 18.32C21.22 18.16 21.19 18 21.11 17.82C21.08 17.76 21.02 17.65 20.83 17.52L17.51 15.16C17.31 15.02 17.13 14.92 16.96 14.85C16.74 14.76 16.65 14.67 16.31 14.88C16.11 14.98 15.93 15.13 15.73 15.33L14.97 16.08C14.58 16.46 13.98 16.55 13.52 16.38L13.25 16.26C12.84 16.04 12.36 15.7 11.83 15.25C11.35 14.84 10.83 14.36 10.2 13.74C9.71 13.24 9.22 12.71 8.71 12.12C8.24 11.57 7.9 11.1 7.69 10.71L7.57 10.41C7.51 10.18 7.49 10.05 7.49 9.91C7.49 9.55 7.62 9.23 7.87 8.98L8.62 8.2C8.82 8 8.97 7.81 9.07 7.64C9.15 7.51 9.18 7.4 9.18 7.3C9.18 7.22 9.15 7.1 9.1 6.98C9.03 6.82 8.92 6.64 8.78 6.45L6.46 3.17C6.36 3.03 6.24 2.93 6.09 2.86C5.93 2.79 5.76 2.75 5.59 2.75ZM13.95 15.01L13.79 15.69L14.06 14.99C14.01 14.98 13.97 14.99 13.95 15.01Z"
                    fill="white"
                  />
                </g>
              </svg>
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Telefon Numarası"
              value={phoneNumber}
              onChange={(e) => handlePhoneNumberChange(e)}
              // onKeyDown={handleKeyDown}
              inputMode="numeric"
              className="outline-none border-none bg-[#222222] text-[16px] font-[400] leading-[21px] text-start ml-[60px]"
            />
          </div>
          {isPhoneNumberError && (
            <p className="error-message text-center text-[14px] font-[400] leading-[18px] opacity-50 mt-3">
              Lütfen geçerli bir telefon numarası giriniz
            </p>
          )}
          <button
            className="btn_primary mt-8 mb-9"
            onClick={() => handleVerification()}
          >
            Doğrula
          </button>
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-3xl py-10 px-10 mt-[4.5rem] mb-9">
        <h4 className="text-[16px] font-[400] leading-[21px] !text-[#FF6438]">
          AVANTAJLAR
        </h4>
        <p className="text-[32px] font-[700] leading-[42px]">
          NEDEN BİZİ SEÇMELİSİNİZ?
        </p>
        <div className="flex gap-[0.938rem] justify-evenly mt-9 flex-wrap">
          <div className="advantage_card !bg-[#FF6438] py-[31px] pl-[1.5rem] rounded-3xl">
            <h4 className="text-[36px] font-[700] leading-[47px]">01</h4>
            <p className="text-[20px] font-[700] leading-[26px] mt-[8px]">
              Fiyat Teklifi
            </p>
            {/* <p className="text-[14px] font-[500] leading-[18px] mt-2 !opacity-100">
              Tüm lojistik ihtiyaçlarınıza özel <br /> çözümler üretiyoruz
            </p> */}
          </div>
          <div className="advantage_card  py-[31px] pl-[1.5rem] rounded-3xl">
            <h4 className="text-[36px] font-[700] leading-[47px] opacity-50">
              02
            </h4>
            <p className="text-[20px] font-[700] leading-[26px] mt-[8px]">
              Hızlı Yük Bulma
            </p>
            {/* <p className="text-[14px] font-[500] leading-[18px] mt-2 opacity-50">
              Tüm lojistik ihtiyaçlarınıza özel
              <br /> çözümler üretiyoruz
            </p> */}
          </div>
          <div className="advantage_card  py-[31px] pl-[1.5rem] rounded-3xl">
            <h4 className="text-[36px] font-[700] leading-[47px] opacity-50">
              03
            </h4>
            <p className="text-[20px] font-[700] leading-[26px] mt-[8px]">
              İlan Sıralama
            </p>
            {/* <p className="text-[14px] font-[500] leading-[18px] mt-2 opacity-50">
              Tüm lojistik ihtiyaçlarınıza özel
              <br /> çözümler üretiyoruz
            </p> */}
          </div>
          <div className="advantage_card py-[31px] pl-[1.5rem] rounded-3xl">
            <h4 className="text-[36px] font-[700] leading-[47px] opacity-50">
              04
            </h4>
            <p className="text-[20px] font-[700] leading-[26px] mt-[8px]">
              Komisyonsuz Taşımacılık
            </p>
            {/* <p className="text-[14px] font-[500] leading-[18px] mt-2 opacity-50">
              Tüm lojistik ihtiyaçlarınıza özel <br />
              çözümler üretiyoruz
            </p> */}
          </div>
        </div>
      </div>
      <div className="bg-[#1A1A1A] pt-9  pb-[49px] rounded-t-2xl">
        <h1 className="text-center text-[48px] font-[700] leading-[62px] mx-[1rem] max-sm:text-[30px]">
          HİZMETLERİMİZDEN YARARLANMAK İÇİN <br /> MOBİL UYGULAMAMIZI İNDİRİN!
        </h1>

        <div className="mt-9 flex justify-center gap-[30px] max-sm:px-[20px]">
          <button className="btn_primary !w-[232px]">Daha fazla</button>
          <button className="btn_secondary !w-[232px]">Uygulamayı indir</button>
        </div>
      </div>
      <footer className="border-t justify-evenly items-between md:items-start dmsans border-solid border-[#2C2C2C] py-[36px] rounded-b-2xl flex flex-col sm:flex-row md:flex-row items-center space-y-12 md:space-y-0 md:justify-start sm:pl-[2rem] text-[18px] md:text-[16px] md:space-x-[3rem] lg:space-x-[9rem] font-[400] leading-[21px] footer_t1 mb-10 bg-[#1A1A1A]">
        <FooterPartial />
      </footer>
    </>
  )
}

export default Page
