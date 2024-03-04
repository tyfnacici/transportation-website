"use client"
import React, { useState } from "react"
import Image from "next/image"

const UseTextInput = ({ placeholder, image, onValueChange, disabled }) => {
  const [value, setValue] = useState("")

  const handleChange = (event) => {
    const newValue = event.target.value
    setValue(newValue)

    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  return (
    <div className="relative h-[55px] rounded-[32px] bg-[#222222] flex items-center flex-grow">
      {image && <Image className="absolute ml-[20px]" src={image} alt="Icon" />}
      <input
        type="text"
        inputMode="numeric"
        id="phone"
        disabled={disabled}
        name="phone"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="outline-none border-none bg-[#222222] dmsans40016 text-start ml-[60px] w-11/12 rounded-r-[32px]"
      />
    </div>
  )
}

export default UseTextInput
