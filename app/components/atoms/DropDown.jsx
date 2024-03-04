"use client";
import React from "react";
import Image from "next/image";
import ArrowDown from "../../../public/assets/images/Vector.png";

const CustomDropdown = ({ options, value, onChange }) => {
  return (
    <div className="custom-dropdown">
      <select
        className="h-[40px] w-[117px] py-[11px] bg-[#222222] dmsans50014 text-white border-none outline-none text-start rounded-[32px] pl-4"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option
            className="dmsans50014 h-[40px]"
            key={option.name}
            value={option.name}
          >
            {option.name}
          </option>
        ))}
      </select>
      <div className="arrow-down">
        <Image src={ArrowDown} width={20} alt="ArrowDown" />
      </div>
    </div>
  );
};
export default CustomDropdown;
