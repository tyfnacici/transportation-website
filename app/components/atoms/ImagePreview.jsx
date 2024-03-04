import React from "react"
import Image from "next/image"

const ImagePreview = ({ previewUrl }) => {
  return (
    <div className="w-[80%] h-[60%]  max-lg:mt-[25%]   overflow-hidden z-[72] items-center text-center">
      {previewUrl && (
        <iframe
          src={previewUrl}
          // height={320}
          // width={320}
          alt="Image Preview"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  )
}

export default ImagePreview
