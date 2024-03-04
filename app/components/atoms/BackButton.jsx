// BackButton.js
import { useRouter } from "next/navigation"

const BackButton = (probs) => {
  const router = useRouter()
  const { fixed } = probs
  const handleBackClick = () => {
    router.back("/dashboard")
  }

  return (
    <button
      className={`${
        fixed ? "fixed" : ""
      }items-center flex justify-center border border-solid border-gray-700 w-[42px] h-[42px] rounded-full bg-[#343434]`}
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
  )
}

export default BackButton
