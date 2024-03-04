"use client"
import React, { useState, useEffect, useContext } from "react"
import Image from "next/image"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"
import { UserContext } from "@/layout"

const NewOffer = (props) => {
  const router = useRouter()
  const [data, setData] = useState({})
  const [receiveDateSelect, setReceiveDateSelect] = useState(false)
  const [deliverDateSelect, setDeliverDateSelect] = useState(false)
  const [datePickerOneStatus, setDatePickerOneStatus] = useState(true)
  const [datePickerTwoStatus, setDatePickerTwoStatus] = useState(true)
  const [receiveDate, setReceiveDate] = useState(new Date())
  const [deliverDate, setDeliverDate] = useState(new Date())
  const [transporterID, setTransporterID] = useState("")
  const [offerData, setOfferData] = useState({})
  const { userState, setUserState } = useContext(UserContext)
  const chatID = props?.params.detail

  const getDataByChatID = async () => {
    if (userState?.user?.role === "TRANSPORTER") {
      await fetch(
        `${process.env.BASEURL}/transporter/get?user=${userState?.user?._id}`
      )
        .then((data) => data.json())
        .then((json) => setTransporterID(json?.data?._id))
      await fetch(
        `${process.env.BASEURL}/chat/list?user=${userState?.user?._id}&transporter=${transporterID}`
      )
        .then((response) => response.json())
        .then((json) => {
          setData(json.data?.filter((data) => data?._id === chatID))
        })
    } else {
      await fetch(
        `${process.env.BASEURL}/chat/list?user=${userState?.user?._id}`
      )
        .then((data) => data.json())
        .then((json) => {
          setData(json.data?.filter((data) => data?._id === chatID))
        })
    }
  }
  //kullanıcı id ve transporter idsi ile ikisinin arasında olan konus
  const offerCreateHandler = async () => {
    const postData = {
      user: userState?.user?._id,
      transporter: data[0]?.transporter?._id,
      chat: chatID,
      receive_date: receiveDate,
      deliver_date: deliverDate,
      description: offerData.desc,
      price: offerData.price,
      listing: data[0]?.listing?._id,
    }

    await fetch(`${process.env.BASEURL}/offer/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((data) => data.json())
      //Buradan popup eklenebilir
      .then(() => router.back())
  }

  useEffect(() => {
    if (userState?.user?._id !== undefined) {
      getDataByChatID()
    }
  }, [userState, transporterID])

  return (
    <div className="card p-[36px] rounded-[36px] bg-[#1A1A1A] justify-items-center text-center mt-[52px] mb-[136px] mx-auto flex flex-col">
      <h3 className="font-[700] text-[24px] pb-[33px] text-start">
        Teklif Detayları
      </h3>
      <div className="flex flex-row space-x-[34px]">
        <div className="bg-[#222222] rounded-[16px] p-[18px] flex justify-center flex-col items-center">
          <div className="flex space-x-[9px]">
            <Image
              src={
                data[0]?.listing?.vehicle?.interior_photo
                  ? data[0]?.listing?.vehicle?.interior_photo
                  : "/assets/images/offerImage.png"
              }
              width={130}
              height={130}
              alt="offer image"
              className=""
            />
            <Image
              src={
                data[0]?.listing?.vehicle?.exterior_photo
                  ? data[0]?.listing?.vehicle?.exterior_photo
                  : "/assets/images/offerImage.png"
              }
              width={130}
              height={130}
              alt="offer image"
              className=""
            />
          </div>
          <div className="self-start pt-[16px] font-[400] text-[16px] flex flex-col space-y-[8px]">
            <div className="flex space-x-1">
              <p className="opacity-50">Tır Tipi: </p>
              <p>{data[0]?.listing?.vehicle?.type}</p>
            </div>
            <div className="flex space-x-1">
              <p className="opacity-50">Plaka: </p>
              <p>{data[0]?.listing?.vehicle?.plate_number}</p>
            </div>
            <div className="flex space-x-1">
              <p className="opacity-50">Yük Kapasitesi: </p>
              <p>{`${data[0]?.listing?.vehicle?.max_load} Ton`}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center flex-col items-center space-y-[12px]">
          <div className="flex flex-col space-y-[8px]">
            <label className="self-start text-[14px] font-[400] opacity-50">
              Teslim edilecek tarih
            </label>
            <div className="flex flex-row items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="opacity-50 z-50 absolute ml-5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 2V5"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16 2V5"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.5 9.08997H20.5"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.6947 13.7H15.7037"
                  stroke="#ffffff"
                  stroke-width="2"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.6947 16.7H15.7037"
                  stroke="#ffffff"
                  stroke-width="2"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.9955 13.7H12.0045"
                  stroke="#ffffff"
                  stroke-width="2"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.9955 16.7H12.0045"
                  stroke="#ffffff"
                  stroke-width="2"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.29431 13.7H8.30329"
                  stroke="#ffffff"
                  stroke-width="2"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.29431 16.7H8.30329"
                  stroke="#ffffff"
                  stroke-width="2"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {receiveDateSelect ? (
                <DateTimePicker
                  ampm={false}
                  autoFocus={true}
                  open={datePickerOneStatus}
                  className="dmsans"
                  format="DD MMMM, HH:mm"
                  value={dayjs(receiveDate)}
                  onOpen={() => setDatePickerOneStatus(true)}
                  onClose={() => setDatePickerOneStatus(false)}
                  onChange={(e) => {
                    setReceiveDate(new Date(e.$d).toISOString())
                  }}
                  sx={{
                    ".MuiInputBase-root": {
                      bgcolor: "#222222",
                      outlineColor: "#222222",
                      padding: "5px 20px 5px 10px",
                      borderRadius: "32px",
                      color: "#ffffff",
                      width: "300px",
                      maxHeight: "55px",
                      fontSize: "16px",
                      outlineColor: "#222222",
                      outline: "none",
                      borderColor: "#222222",
                      fontFamily: "unset",
                      fontWeight: "400",
                    },
                    ".MuiInputBase-input": {
                      paddingLeft: "50px",
                    },
                    ".MuiIconButton-edgeEnd": {
                      color: "#ffffff",
                      justifySelf: "start",
                    },
                    ".MuiButtonBase-root": {
                      position: "absolute",
                      left: "0px",
                      borderRadius: "32px",
                      width: "300px",
                      height: "55px",
                    },
                    ".MuiSvgIcon-root": {
                      display: "none",
                    },
                  }}
                />
              ) : (
                <button
                  className="bg-[#222222] text-center items-center w-[300px] text-white h-[55px] px-5 rounded-[32px] py-2 flex pl-[60px]"
                  onClick={() => {
                    setReceiveDateSelect(true)
                  }}
                >
                  Bir tarih seçiniz
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-[8px]">
            <label className="self-start text-[14px] font-[400] opacity-50">
              Teslim alınacak tarih
            </label>
            <div className="flex flex-row items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="opacity-50 z-50 absolute ml-5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 2V5"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16 2V5"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.5 9.08997H20.5"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.6947 13.7H15.7037"
                  stroke="#ffffff"
                  stroke-width="2"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.6947 16.7H15.7037"
                  stroke="#ffffff"
                  stroke-width="2"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.9955 13.7H12.0045"
                  stroke="#ffffff"
                  stroke-width="2"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.9955 16.7H12.0045"
                  stroke="#ffffff"
                  stroke-width="2"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.29431 13.7H8.30329"
                  stroke="#ffffff"
                  stroke-width="2"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.29431 16.7H8.30329"
                  stroke="#ffffff"
                  stroke-width="2"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {deliverDateSelect ? (
                <DateTimePicker
                  ampm={false}
                  open={datePickerTwoStatus}
                  autoFocus={true}
                  className="dmsans"
                  format="DD MMMM, HH:mm"
                  value={dayjs(deliverDate)}
                  minDateTime={dayjs(receiveDate)}
                  onOpen={() => setDatePickerTwoStatus(true)}
                  onClose={() => setDatePickerTwoStatus(false)}
                  onChange={(e) => {
                    setDeliverDate(new Date(e.$d).toISOString())
                  }}
                  sx={{
                    ".MuiInputBase-root": {
                      bgcolor: "#222222",
                      outlineColor: "#222222",
                      padding: "5px 20px 5px 10px",
                      borderRadius: "32px",
                      color: "#ffffff",
                      width: "300px",
                      maxHeight: "55px",
                      fontSize: "16px",
                      outlineColor: "#222222",
                      outline: "none",
                      borderColor: "#222222",
                      fontFamily: "unset",
                      fontWeight: "400",
                    },
                    ".MuiInputBase-input": {
                      paddingLeft: "50px",
                    },
                    ".MuiIconButton-edgeEnd": {
                      color: "#ffffff",
                      justifySelf: "start",
                    },
                    ".MuiButtonBase-root": {
                      position: "absolute",
                      left: "0px",
                      borderRadius: "32px",
                      width: "300px",
                      height: "55px",
                    },
                    ".MuiSvgIcon-root": {
                      display: "none",
                    },
                  }}
                />
              ) : (
                <button
                  className="bg-[#222222] text-center items-center w-[300px] text-white h-[55px] px-5 rounded-[32px] py-2 flex pl-[60px]"
                  onClick={() => {
                    setDeliverDateSelect(true)
                  }}
                >
                  Bir tarih seçiniz
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-[8px] w-full">
            <label className="self-start text-[14px] font-[400] opacity-50">
              Fiyat
            </label>
            <div className="flex flex-row relative items-center">
              <svg
                width="24"
                height="24"
                className="opacity-50 z-50 absolute ml-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.67188 14.3298C8.67188 15.6198 9.66188 16.6598 10.8919 16.6598H13.4019C14.4719 16.6598 15.3419 15.7498 15.3419 14.6298C15.3419 13.4098 14.8119 12.9798 14.0219 12.6998L9.99187 11.2998C9.20187 11.0198 8.67188 10.5898 8.67188 9.36984C8.67188 8.24984 9.54187 7.33984 10.6119 7.33984H13.1219C14.3519 7.33984 15.3419 8.37984 15.3419 9.66984"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 6V18"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <input
                type="number"
                placeholder="Bir fiyat giriniz"
                className="bg-[#222222] max-w-[300px] text-white h-[55px] px-5 rounded-[32px] w-full py-2 flex pl-[60px]"
                value={null}
                onChange={(e) =>
                  setOfferData({
                    ...offerData,
                    price: e.target.value,
                  })
                }
              />
              <p className="opacity-50 absolute pr-6 right-0">TL</p>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-[16px]">
        <textarea
          className="bg-[#222222] w-full rounded-[16px] h-44 leading-5 px-4 py-5"
          value={offerData?.desc}
          placeholder="Bir açıklama giriniz."
          onChange={(e) =>
            setOfferData({
              ...offerData,
              desc: e.target.value,
            })
          }
        />
        <div className="text-start font-[400] text-[12px] opacity-50 pt-[10px]">
          <p>Yasal bilgilendirme:</p>
          <p>
            Taşıma işlemlerine ait ödemeler müşteri ile nakliyeci arasında
            yapılmaktadır. transportation sorumluluk kabul etmez.
          </p>
          <br />
          <p>Teklif süresi 3 iş günüdür</p>
        </div>
        <div className="flex justify-between space-x-[45px] pt-[21px]">
          <div className="flex-grow" />
          <div className="flex flex-grow space-x-[10px]">
            <button
              onClick={() => router.back()}
              className="h-[60px] w-1/2 bg-[#222222] border-[1px] flex-grow border-[#343434] text-white rounded-[16px]"
            >
              Yoksay
            </button>
            <button
              className="h-[60px] w-1/2 bg-[#FF6438] text-white flex-grow rounded-[16px]"
              onClick={() => offerCreateHandler()}
            >
              Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewOffer
