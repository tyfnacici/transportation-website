"use client";

import React from "react";

export default function modal({ isVisible, children, onClose }) {
  const closeHandler = (e) => {
    if (e.target.id === "wrapper") onClose();
  };

  if (!isVisible) return null;
  return (
    <div
      className="fixed z-50 inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex justify-center items-center"
      id="wrapper"
      onClick={closeHandler}
    >
      <div className="rounded-[32px]">{children}</div>
    </div>
  );
}
