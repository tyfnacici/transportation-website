import React from "react"

const TimestampComponent = ({ sentTime }) => {
  const date = new Date(sentTime * 1000)

  const monthNames = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ]

  const formattedDate = `${date.getDate()} ${
    monthNames[date.getMonth()]
  }, ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`

  return (
    <span className="dmsans40012 opacity-50 mt-[8px]">{formattedDate}</span>
  )
}

export default TimestampComponent
