// "use client";
// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useLayoutEffect,
//   useContext,
// } from "react";
// import ChatInfoCard from "./atoms/chatInfoCard.jsx";
// import Image from "next/image";
// import userImage from "../../public/assets/images/userImage.png";
// import ArrowRightSvg from "../../public/assets/images/arrow-right.svg";
// import MoreSVG from "../../public/assets/images/more.svg";
// import paperPlaneSVG from "../../public/assets/images/paper-plane.svg";
// import NewOfferChatCard from "./atoms/NewOfferChatCard.jsx";
// import TimestampComponent from "./atoms/TimestampComponent.jsx";
// import {
//   collection,
//   onSnapshot,
//   orderBy,
//   query,
//   serverTimestamp,
//   addDoc,
// } from "firebase/firestore";
// import { db } from ".././firebase/firebase-config.js";
// import auth from ".././firebase/firebase-config.js";
// import { generateId, AuthContext } from "./utilities";
// import ImagePreview from "./atoms/ImagePreview.jsx";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// const Messages = () => {
//   const [messages, setMessages] = useState([]);
//   const [user, setUser] = useState({ id: 1, name: "User1" });
//   const [offer, setOffer] = useState("");
//   const [newMessage, setNewMessage] = useState("");
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [uploadModalVisible, setUploadModalVisible] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [chats, setChats] = useState(null);
//   const [imgUrl, setImgUrl] = useState(null);
//   const [sendImage, setSendImage] = useState(null);

//   const { currentUser } = useContext(AuthContext);
//   console.log("currentUser");
//   console.log(currentUser);
//   useEffect(() => {
//     // if (chats) {
//     //   chats.forEach((chat) => {
//     //     if (chat.id === "TGQ6qEBG") {
//     //       setOffer(chat);
//     //     }
//     //   });
//     // }
//     setUser(user);
//   }, []);

//   const scroll = useRef();
//   const storage = getStorage();

//   const sendImagePreview = () => {
//     uploadImage(sendImage);
//     setUploadModalVisible(false);
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     sendNewMessage(newMessage, imgUrl);
//   };

//   const sendNewMessage = async (newMessage, media_url) => {
//     const newMessageObject = {
//       from: "rbH9rAqr9TXZpo0jV3GkeaSNFNG2" || user?.uid,
//       media_url: media_url,
//       message: newMessage,
//       message_at: serverTimestamp(),
//       to: "TGQ6qEBG",
//     };

//     await addDoc(collection(db, "chats"), newMessageObject);

//     setMessages([...messages, newMessageObject]);
//     setNewMessage("");
//     setImgUrl(null);
//     setSendImage(null);

//     scroll.current.scrollIntoView({ behavior: "smooth" });
//   };

//   const uploadImage = async (file) => {
//     const storageRef = ref(storage, `images/${generateId()}`);
//     await uploadBytes(storageRef, file).then((value) => {
//       getDownloadURL(value.ref).then((url) => {
//         setImgUrl(url);
//         sendNewMessage(newMessage, url);
//       });
//     });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setSendImage(file);

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result);
//       setUploadModalVisible(true);
//     };
//     if (file) {
//       reader.readAsDataURL(file);
//     }
//   };

//   const openImageModal = (selectedImageUrl) => {
//     setSelectedImage(selectedImageUrl);
//     setModalVisible(true);
//   };

//   const closeImageModal = () => {
//     setSelectedImage(null);
//     setModalVisible(false);
//   };

//   const handleModalClick = (e) => {
//     if (e.target.classList.contains("modal-overlay")) {
//       closeImageModal();
//     }
//   };

//   useEffect(() => {
//     const q = query(collection(db, "chats"), orderBy("message_at"));
//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const chats = [];
//       querySnapshot.forEach((doc) => {
//         chats.push({ ...doc.data(), id: doc.id });
//       });

//       setMessages(chats);
//       setChats(chats);
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <>
//       {modalVisible && (
//         <div
//           className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center modal-overlay"
//           onClick={handleModalClick}
//         >
//           <ImagePreview previewUrl={selectedImage} />
//         </div>
//       )}
//       {uploadModalVisible && (
//         <div
//           className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70  justify-center items-center modal-overlay z-50 flex flex-col"
//           onClick={handleModalClick}
//         >
//           <ImagePreview previewUrl={imagePreview} />
//           <div className="mt-[22px]">
//             <button
//               className="btn_outline_black !w-[75px] !h-[40px]  !text-[14px] "
//               onClick={() => setUploadModalVisible(false)}
//             >
//               iptal
//             </button>
//             <button
//               className="btn_primary !w-[75px] !h-[40px] !text-[14px] ml-[16px] "
//               onClick={sendImagePreview}
//             >
//               Gönder
//             </button>
//           </div>
//         </div>
//       )}
//       <div className="flex">
//         <div className="w-[536px] rounded-[32px] h-[676px] bg-[#1A1A1A] pt-[32px]">
//           <div className="flex justify-between border-b border-solid border-gray-700 px-9 pb-[22px]">
//             <div className="flex items-center gap-4">
//               <Image
//                 className="rounded-full"
//                 src={userImage}
//                 width={28}
//                 height={28}
//                 alt="User Image"
//               />
//               <p className="text-white dmsans40014">{user?.name || "Burak"}</p>
//             </div>
//             <Image
//               src={MoreSVG}
//               alt="User Image"
//               width={20}
//               height={20}
//             ></Image>
//           </div>
//           <div className="">
//             <div className="flex justify-between text-start border-b border-solid border-gray-700 px-9 py-[16px]   ">
//               <div>
//                 <div className=" dmsans40014">
//                   {offer?.description?.slice(0, 45) ||
//                     "Profesyonel nakliye hizmeti için bize ulaşın"}
//                   ...
//                 </div>
//                 <p className="dmsans40014 opacity-50 mt-1">
//                   {offer?.destination || "Ankara > Istanbul"} •{" "}
//                   {offer?.price || "14.500"} TL
//                 </p>
//               </div>
//               <Image
//                 src={ArrowRightSvg}
//                 alt="User Image"
//                 width={16}
//                 height={16}
//               ></Image>
//             </div>
//             <div
//               ref={scroll}
//               className="h-[363px] overflow-auto pt-[16px] flex flex-col px-9
//              "
//             >
//               {messages.map((message, index) => (
//                 <React.Fragment key={index}>
//                   <div
//                     className={`px-4 py-3 rounded-2xl dmsans40016 max-w-[48%] ${
//                       user?.uid == message?.from
//                         ? "border border-solid border-gray-700  !bg-[#2C2C2C]  bg-gradient-to-b from-[#222222] to-[#2C2C2C] self-end "
//                         : "bg-gradient-to-b from-red-600 via-red-500 to-red-800 text-left"
//                     }`}
//                     onClick={() => {
//                       if (message?.media_url) {
//                         openImageModal(message?.media_url);
//                       }
//                     }}
//                   >
//                     {message?.media_url ? (
//                       <>
//                         <img src={message.media_url} alt="Image" />
//                       </>
//                     ) : (
//                       <>
//                         <p className="dmsans40012 ">{message.message}</p>
//                       </>
//                     )}
//                   </div>
//                   <div
//                     className={`mb-[20px]  ${
//                       user.uid == message?.from ? " self-end " : " text-left"
//                     }`}
//                   >
//                     <TimestampComponent sentTime={message.message_at} />
//                   </div>
//                 </React.Fragment>
//               ))}
//             </div>
//             {offer ? <NewOfferChatCard offer={offer} /> : null}
//           </div>
//           <div className="">
//             <div className="px-9 mt-[16px] ">
//               <form
//                 onSubmit={handleSendMessage}
//                 className="flex justify-between  items-center"
//               >
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="sr-only"
//                   id="imageInput"
//                 />
//                 <label htmlFor="imageInput" className="cursor-pointer">
//                   <svg
//                     width="32"
//                     height="32"
//                     viewBox="0 0 32 32"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M24 17H8C7.45333 17 7 16.5467 7 16C7 15.4533 7.45333 15 8 15H24C24.5467 15 25 15.4533 25 16C25 16.5467 24.5467 17 24 17Z"
//                       fill="#FF6438"
//                     />
//                     <path
//                       d="M16 25C15.4533 25 15 24.5467 15 24V8C15 7.45333 15.4533 7 16 7C16.5467 7 17 7.45333 17 8V24C17 24.5467 16.5467 25 16 25Z"
//                       fill="#FF6438"
//                     />
//                   </svg>
//                 </label>
//                 <input
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   className="dmsans40014 bg-[#2C2C2C] rounded-[32px] w-[370px] h-[55px] px-[16px] py-[10px] ml-[16px] outline-none"
//                   placeholder="Mesajınızı yazın..."
//                 />
//                 <button type="submit" className="">
//                   <Image
//                     src={paperPlaneSVG}
//                     alt="send message icon"
//                     width={24}
//                     height={24}
//                   />
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Messages;
