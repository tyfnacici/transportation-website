"use client"
import React, { useContext } from "react"
import { useState, useEffect } from "react"
import PostCardItem from "../components/atoms/postCardItem"
import { useRouter } from "next/navigation"
import { UserContext } from "@/layout.jsx"

const HomePage = () => {
  const { userState, setUserState } = useContext(UserContext)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState([])
  const [cities, setCities] = useState([])
  const [selectedSorting, setSelectedSorting] = useState("")
  const [filteredPosts, setFilteredPosts] = useState([])
  const [city1, setCity1] = useState("Nereden") //nereden
  const [city2, setCity2] = useState("Nereye") //nereye

  useEffect(() => {
    fetchCities()
    fetchPostData()
    fetchFilteredPostData(selectedSorting, city1, city2)
  }, [selectedSorting, city1, city2])

  const [optionValue, setOptionValue] = useState([
    "Puana Göre",
    "Fiyat Artan",
    "Fiyat Azalan",
  ])

  //handling functions
  const handleCity1Change = (city) => {
    setCity1(city)
    fetchFilteredPostData(selectedSorting, city, city2)
  }

  const handleCity2Change = (city) => {
    setCity2(city)
    fetchFilteredPostData(selectedSorting, city1, city)
  }

  const handleOrderingChange = (sorting) => {
    setSelectedSorting(sorting)
    fetchFilteredPostData(sorting, city1, city2)
  }

  // Fetching

  const fetchCities = async () => {
    try {
      await fetch(`${process.env.BASEURL}/listing/get-cities`, {
        cache: "force-cache",
      })
        .then((data) => data.json())
        .then((data) => setCities(data?.data?.cities))
    } catch (error) {
      console.error("Error fetching dummy data:", error)
      return []
    }
  }

  const fetchPostData = async () => {
    try {
      await fetch(`${process.env.BASEURL}/listing/featured`, {
        cache: "force-cache",
      })
        .then((data) => data.json())
        .then((data) => {
          setPosts(data?.data)
          setFilteredPosts(data?.data)
        })
    } catch (error) {
      console.error("Error fetching dummy data:", error)
      return []
    }
  }

  // Filtering function
  const fetchFilteredPostData = async (filterValue, city1, city2) => {
    try {
      let sortingValue = undefined

      // Sorting value assignment
      if (filterValue?.length > 0) {
        switch (filterValue) {
          case optionValue[0]:
            sortingValue = 1
            break
          case optionValue[1]:
            sortingValue = 2
            break
          case optionValue[2]:
            sortingValue = 3
            break
          default:
            sortingValue = 0
            break
        }
      }

      const updatedPostData = {
        ...(city1 !== "Nereden" && { from_where: city1 }),
        ...(city2 !== "Nereye" && { to_where: city2 }),
        ...(sortingValue > 0 && { sort: sortingValue }),
      }

      setLoading(true)

      await fetch(`${process.env.BASEURL}/listing/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "force-cache",
        body: JSON.stringify(updatedPostData),
      })
        .then((data) => data?.json())
        .then((json) => {
          setFilteredPosts(json?.data)
          setLoading(false)
        })
    } catch (error) {
      console.error("Error dummy data:", error)
      return []
    }
  }

  const redirectHandler = (url) => {
    router.push(`/dashboard/offer/${url}`)
  }

  return (
    <>
      <div className="self-start">
        <p className="mb-[16px] text-[24px] font-[700] text-start lg:text-start">
          Öne çıkan ilanlar
        </p>
        {/* Featured Posts Start */}
        <div className="flex flex-row flex-wrap justify-start gap-x-[15px] gap-y-[24px] max-lg:justify-center w-full">
          {posts.map((post, index) => (
            <div
              onClick={() => redirectHandler(post?._id)}
              key={post?._id || index}
            >
              <PostCardItem listing={post} />
            </div>
          ))}
        </div>
      </div>

      <div className="items-center justify-center gap-4 sm:flex-row lg:justify-start lg:text-start max-w-[950px]">
        <div className="mb-[16px] mt-9 items-center justify-center gap-4 sm:flex-row lg:justify-start lg:text-start">
          <p className="mb-[16px] text-[24px] font-[700] text-center lg:text-start">
            Filtrele
          </p>
          {/* Filtering Section */}
          <div className="card flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start lg:text-start">
            {/* Ordering Button */}
            <div className="flex flex-row items-center w-[150px] rounded-[32px] relative justify-end bg-[#222222]">
              {/* Ordering by button */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="ml-[10px] opacity-50 absolute left-0"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 5.83325H17.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M5 10H15"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M8.33334 14.1667H11.6667"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <select
                className="h-[40px] text-[15px] text-center font-[400] pl-[20px] bg-inherit focus:outline-none w-full rounded-[32px]"
                onChange={(e) => handleOrderingChange(e.target.value)}
                value={selectedSorting}
              >
                <option value="" defaultValue>
                  Sırala
                </option>
                {optionValue.map((option) => (
                  <option value={option} key={option + "1"}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {/* Nereden button */}
            <div className="flex flex-row items-center w-[175px] rounded-[32px] relative justify-end bg-[#222222]">
              <select
                className="h-[40px] text-[15px] text-center font-[400] pr-[20px] bg-inherit focus:outline-none w-full rounded-[32px]"
                onChange={(e) => {
                  handleCity1Change(e.target.value)
                }}
                value={city1}
              >
                <option value="" defaultValue>
                  Nereden
                </option>
                {cities.map((city) => (
                  <option value={city} key={city + "1"}>
                    {city}
                  </option>
                ))}
              </select>
              <svg
                width="20"
                height="20"
                className="mr-[16px] absolute right-0"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    d="M14.9333 6.81665H9.74167H5.06667C4.26667 6.81665 3.86667 7.78332 4.43334 8.34998L8.75 12.6667C9.44167 13.3583 10.5667 13.3583 11.2583 12.6667L12.9 11.025L15.575 8.34998C16.1333 7.78332 15.7333 6.81665 14.9333 6.81665Z"
                    fill="white"
                  />
                </g>
              </svg>
            </div>
            {/* Nereye button */}
            <div className="flex flex-row items-center w-[175px] rounded-[32px] relative justify-end bg-[#222222]">
              <select
                className="h-[40px] text-[15px] text-center font-[400] pr-[20px] bg-inherit focus:outline-none w-full rounded-[32px]"
                onChange={(e) => {
                  handleCity2Change(e.target.value)
                }}
                value={city2}
              >
                <option value="" defaultValue>
                  Nereye
                </option>
                {cities.map((city) => (
                  <option value={city} key={city + "1"}>
                    {city}
                  </option>
                ))}
              </select>
              <svg
                width="20"
                height="20"
                className="mr-[16px] absolute right-0"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    d="M14.9333 6.81665H9.74167H5.06667C4.26667 6.81665 3.86667 7.78332 4.43334 8.34998L8.75 12.6667C9.44167 13.3583 10.5667 13.3583 11.2583 12.6667L12.9 11.025L15.575 8.34998C16.1333 7.78332 15.7333 6.81665 14.9333 6.81665Z"
                    fill="white"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
        {/* Filtering Section End */}

        {/* Sorted Post Start */}
        <div className="flex flex-row flex-wrap justify-start gap-x-[15px] gap-y-[24px] max-lg:justify-center mb-[71px] w-full">
          {loading ? (
            <p>Yükleniyor...</p>
          ) : (
            filteredPosts.map((post, index) => (
              <div onClick={() => redirectHandler(post?._id)} key={post?._id}>
                <PostCardItem listing={post || index} />
              </div>
            ))
          )}
        </div>
        {/* Sorted Post End */}
      </div>
      {/* Filtered Post End */}
    </>
  )
}

export default HomePage
