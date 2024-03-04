import React from "react";
import Image from "next/image";

const MessageComponent = ({ message, user, openImageModal }) => {
  return (
    <div
      className={`px-4 py-3 rounded-2xl dmsans40016 max-w-[48%] ${
        user.id === message?.senderUser.id
          ? "border border-solid border-gray-700 !bg-[#2C2C2C] bg-gradient-to-b from-[#222222] to-[#2C2C2C] self-end"
          : "bg-gradient-to-b from-red-600 via-red-500 to-red-800 text-left"
      }`}
      onClick={() => {
        if (message.contentType === "image") {
          openImageModal(message.image);
        }
      }}
    >
      {message.contentType === "image" ? (
        <Image src={message.image} width={100} height={100} alt="Image" />
      ) : (
        <p className="dmsans40012">{message.content}</p>
      )}
    </div>
  );
};

export default MessageComponent;
