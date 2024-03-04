"use client"
import { useState, useEffect, useContext, useCallback } from "react"
//import offerImage from "@/public/assets/images/offerbigpage.png";
// import offerImage2 from "../../../../../public/assets/images/offerbigpage.png"
import Image from "next/image"
import StarRating from "../../../components/atoms/StarRating.jsx"
import { UserContext } from "@/layout.jsx"
import { useRouter } from "next/navigation"
import BackButton from "@/components/atoms/BackButton"
import PostCardItem from "@/components/atoms/postCardItem"
import {
  AuthContext,
  priceFormatHandler,
} from "../../../components/utilities/index"
import truncateDescription from "../../../components/utilities/index"
import tr from "dayjs/locale/tr.js"

const OfferDetailPage = (props) => {
  const postId = props.params.detail
  const [post, setPost] = useState()
  const [otherPosts, setOtherPosts] = useState([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const router = useRouter()
  const [userID, setUserID] = useState("")
  const { userState, setUserState } = useContext(UserContext)

  useEffect(() => {
    if (userState.user) {
      setUserID(userState.user._id)
    }
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(
          `${process.env.BASEURL}/user/get?user=${userState.user?._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        const data = await response.json()
        if (data.data.plan !== null) {
          setIsSubscribed(true)
        } else {
          setIsSubscribed(false)
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error)
      }
    }
    fetchSubscriptions()

    const fechTransporterOtherlistings = async (transporterId) => {
      try {
        const response = await fetch(
          `${process.env.BASEURL}/offer/list?transporter=${transporterId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        const data = await response.json()
        const filteredListings = data.data.filter(
          (item) => item.listing._id !== postId
        )
        const uniqueListings = filteredListings.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.listing._id === item.listing._id)
        )
        const listings = uniqueListings.map((item) => item.listing)
        setOtherPosts(listings)
      } catch (error) {
        console.error("Error fetching transporter listings:", error)
      }
    }

    const linstingFetch = async (postId) => {
      try {
        const response = await fetch(
          `${process.env.BASEURL}/listing/get?id=${postId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        const data = await response.json()
        setPost(data.data)

        await fechTransporterOtherlistings(data.data.transporter._id)
      } catch (error) {
        console.error("Error fetching listing:", error)
      }
    }

    if (userState.user) {
      linstingFetch(postId)
    }
  }, [postId, userState])
  if (!post) {
    return <div>Loading...</div>
  } else {
  }

  const routeChatToUser = async () => {
    try {
      const response = await fetch(`${process.env.BASEURL}/chat/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userID,
          transporter: post?.transporter?._id,
          listing: postId,
        }),
      })
      const data = await response.json()

      router.push(`/dashboard/${data.data?._id}`)
    } catch (error) {
      console.error("Error creating chat:", error)
    }
  }
  const TimestampComponent = (dateTimeString) => {
    if (!dateTimeString) return "" // Return empty string if no date provided

    const date = new Date(dateTimeString)
    const day = date.getDate()
    const monthIndex = date.getMonth()
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes()

    // Define month names in Turkish
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

    // Format the date and time
    const formattedDate = `${day} ${monthNames[monthIndex]} ${year}, ${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}`

    return formattedDate
  }

  return (
    <div className="">
      <div className=" mb-[36px] ">
        <BackButton fixed={false} />
      </div>

      {!isSubscribed ? (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="flex flex-col justify-center items-center bg-[#1C1C1C] p-8 rounded-lg shadow-md max-w-[320px]">
            <h1 className="text-[20px] font-normal">
              🚚 Nakliyecinin Diğer İlanlarına Göz Atmak İçin Hemen Üye Olun! 🌟
              <br></br>
              Abone olun, avantajl arı keşfedin, ilan detaylarına ulaşın. 📦🔒
            </h1>
            <div />
          </div>
        </div>
      ) : null}
      <div className={`${isSubscribed ? "" : "blur-[10px]"}`}>
        <div className="flex justify-between gap-[44px] flex-wrap  max-w-[921px] pr-[20px] max-lg:justify-center  ">
          <div className="max-w-[507px] object-cover">
            {post?.image ? (
              <img
                alt="offer image"
                src={post?.image}
                className="object-cover max-w-[507px] max-h-[290px] rounded-2xl"
              ></img>
            ) : (
              ""
            )}
            <h1 className=" mt-[20px] font-medium text-[32px]">
              {truncateDescription(post?.title, 60)}
            </h1>
            <p className=" mt-[12px] text-sm opacity-50 font-normal">
              {truncateDescription(post?.description, 300) ||
                "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, toSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, toSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, to"}
            </p>
          </div>
          <div className="text-sm font-normal  w-[350px]">
            <div className="py-[20px] border-b border-solid border-[#2C2C2C] flex justify-between">
              <p className=" opacity-50">Tır tipi</p>
              <p className="">{post?.vehicle.type}</p>
            </div>
            <div className="py-[20px] border-b border-solid flex justify-between border-[#2C2C2C]">
              <p className=" opacity-50">Nereden</p>
              <p className=""> {post?.from_where}</p>
            </div>
            <div className="py-[20px] border-b  flex justify-between border-solid border-[#2C2C2C]">
              <p className=" opacity-50">Nereye</p>
              <p className="">{post?.to_where}</p>
            </div>
            <div className=" flex justify-between  py-[20px] border-b border-solid border-[#2C2C2C]">
              <p className=" opacity-50">GPS ile takip edilebilir</p>
              <p className="">
                {post?.is_trackable == true ? "Evet" : "Hayir"}
              </p>
            </div>
            <div className=" flex justify-between py-[20px] border-b border-solid border-[#2C2C2C]">
              <p className=" opacity-50">Tarih</p>
              <p className=" ">
                {post.created_at ? TimestampComponent(post?.created_at) : ""}
              </p>
            </div>
            <div className=" flex justify-between py-[20px] items-center">
              <div className="flex gap-[15px] ">
                {post?.transporter ? (
                  <img
                    src={post?.transporter?.photo}
                    // width={40}
                    // height={40}
                    alt="User Image"
                    className="rounded-full w-[40px] h-[40px] object-cover"
                  />
                ) : (
                  ""
                )}
                <div>
                  <p className="dmsans70016 text-[16px] mb-1">
                    {post?.transporter.name}
                  </p>
                  <div className=" flex gap-1">
                    <StarRating
                      reviewRate={
                        post?.transporter.total_rating /
                        post?.transporter.total_rating_count
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <div
                  onClick={() =>
                    router.push(`/dashboard/profile/${post?.transporter?._id}`)
                  }
                  className="dmsans40012 text-[12px] opacity-50 flex gap-1 cursor-pointer"
                >
                  <p> Profile git</p>
                  <div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.0249 4.94165L17.0832 9.99998L12.0249 15.0583"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.9165 10H16.9415"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-[10px]">
              <div className="border border-solid border-[#414141] h-[60px] w-[127px] rounded-2xl flex justify-center items-center  text-base font-medium">
                {post?.price === 0
                  ? "Teklif iste"
                  : priceFormatHandler(post?.price) + " TL"}
              </div>
              {post?.transporter?.user === userState?.user?._id ? (
                ""
              ) : (
                <button
                  onClick={() => routeChatToUser()}
                  className="btn_primary !w-[214px] !h-[60px] outline-none dmsans50014 text-base font-bold flex justify-center items-center gap-[8px] !rounded-2xl"
                  type="button"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path
                        d="M15.3917 14.0251L15.7167 16.6584C15.8 17.3501 15.0583 17.8334 14.4667 17.4751L11.5833 15.7584C11.3833 15.6417 11.3333 15.3917 11.4417 15.1917C11.8583 14.4251 12.0833 13.5584 12.0833 12.6917C12.0833 9.64175 9.46667 7.15841 6.25 7.15841C5.59167 7.15841 4.95 7.25841 4.35 7.45841C4.04167 7.55841 3.74167 7.27508 3.81667 6.95842C4.575 3.92508 7.49167 1.66675 10.975 1.66675C15.0417 1.66675 18.3333 4.74175 18.3333 8.53341C18.3333 10.7834 17.175 12.7751 15.3917 14.0251Z"
                        fill="white"
                      />
                      <path
                        d="M10.8333 12.6918C10.8333 13.6834 10.4667 14.6001 9.85 15.3251C9.025 16.3251 7.71667 16.9668 6.25 16.9668L4.075 18.2584C3.70834 18.4834 3.24167 18.1751 3.29167 17.7501L3.5 16.1084C2.38334 15.3334 1.66667 14.0918 1.66667 12.6918C1.66667 11.2251 2.45001 9.93345 3.65 9.16678C4.39167 8.68345 5.28334 8.40845 6.25 8.40845C8.78334 8.40845 10.8333 10.3251 10.8333 12.6918Z"
                        fill="white"
                      />
                    </g>
                  </svg>
                  Mesaj Gönder
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-[36px] mb-[65px] max-lg:mb-[72px] ">
          <h2 className="text-lg font-medium mb-[20px] max-lg:text-center">
            Nakliyecinin diğer ilanları
          </h2>
          <div>
            <div className="flex flex-row flex-wrap justify-start gap-[15px] max-lg:justify-center  max-sm:gap-[35px] ">
              {otherPosts[0] ? (
                otherPosts.map((item) => (
                  <div key={item._id}>
                    <PostCardItem listing={item} />
                  </div>
                ))
              ) : (
                <div>Nakliyecinin başka ilanı bulunmamaktadır</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfferDetailPage
