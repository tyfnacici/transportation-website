import auth from "@/firebase/firebase-config"
import React, { useState, createContext, useEffect } from "react"

const truncateDescription = (reviewDescription, maxLength) => {
  return reviewDescription?.length > maxLength
    ? reviewDescription?.slice(0, maxLength - 3) + "..."
    : reviewDescription
}

export default truncateDescription

export const AuthContext = createContext(false)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [pending, setPending] = useState(true)

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setPending(false)
    })
  }, [])

  if (pending) {
    return <>Loading...</>
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const priceFormatHandler = (price) => {
  return new Intl.NumberFormat().format(price)
}

export const checkUserAuthentication = () => {
  auth.onAuthStateChanged((user) => (this.currentUser = user))
  const storedUser = localStorage.getItem("User")
  try {
    const parsedUser = JSON.parse(storedUser)
    return parsedUser
  } catch (error) {
    console.error("Error parsing user:", error)
    return false
  }
}

export const generateId = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let randomId = ""

  for (let i = 0; i < 24; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomId += characters.charAt(randomIndex)
  }

  return randomId
}

export const formatDate = (timestamp) => {
  const options = {
    month: "long",
    day: "numeric",
  }
  const date = new Date(timestamp)
  const formattedDate = date.toLocaleDateString("tr-TR", options)
  const formattedTime = date.toLocaleTimeString("tr-TR", {
    hour: "numeric",
    minute: "numeric",
  })
  return `${formattedDate}, ${formattedTime}`
}
