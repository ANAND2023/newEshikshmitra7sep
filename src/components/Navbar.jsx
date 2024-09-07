import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { UserProfile } from ".";
import { useStateContext } from "../contexts/ContextProvider";
import axios from "axios";
import "./style.css"
import Cookies from "js-cookie";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {

  const authToken = Cookies.get("token");
  const [schoolInfo, setSchoolInfo] = useState({
    schoolName: "",
    role: "",
    schoolImage: "",
  });
  useEffect(() => {
    axios
      .get(
        "https://eshikshaserver.onrender.com/api/v1/adminRoute/getAdminInfo",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        const schoolImage = response.data.admin.image.url;
        const schoolName = response.data.admin.schoolName;
        const schoolContact=response.data.admin.contact;
        const schooladdress=response.data.admin.address;
        const role = response.data.admin.role;
   
        sessionStorage.setItem("schoolName",schoolName)
        sessionStorage.setItem("schoolContact",schoolContact)
        sessionStorage.setItem("schooladdress",schooladdress)
        sessionStorage.setItem("contact",schoolContact)

        setSchoolInfo({
          schoolName,
          role,
          schoolImage,
        });
      })
      
      .catch((error) => {
        console.error("Response error", error);
      });
  }, []);


  const fullName = sessionStorage.getItem("fullName");
  const image = sessionStorage.getItem("image");
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  const schoolName = sessionStorage.getItem("schoolName");

  return (
    // <div className="fixed z-[99] mb-10 bg-gray-100 w-full">
    <div className="flex justify-between relative  bg-gray-100 ">
      {/* <div className="flex   justify-between  md:ml-6 md:mr-6 relative bg-yellow-400"> */}
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />
      <div className=" w-full text-center dark:text-white ">
        <div className="  mb-1">
        <span className="md:text-xl sm:text-xs text-[10px]  font-semibold">{schoolName}</span>
        </div>
        
        <marquee
          className="html-marquee"
          direction="left"
          behavior="scroll"
          scrollamount="6"
        >
          <p style={{ color: currentColor }}>
            Technical Support and Query Helpline Numbers : +91 9650388201, +91 8920377548, +91 7079771102
            \ Email:corplyxtechnologies@gmail.com
          </p>
        </marquee>
      </div>
      <div className="flex pr-5 bg-gray-100 ">
        <NavButton
          title="Notification"
          dotColor="rgb(254, 201, 15)"
          customFunc={() => handleClick("notification")}
          color={currentColor}
          icon={<RiNotification3Line />}
        />
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex  items-center gap-2 cursor-pointer p-1 dark:hover:bg-gray-800 rounded-lg"
            onClick={() => handleClick("userProfile")}
          >
            <img
              className="rounded-full w-8 h-8"
              src={image}
              alt="user-profile"
            />
            <p>
              <span className="text-black-400 text-[12px] font-bold  dark:text-white ">
                Hi,
              </span>{" "}
              <span className="text-black-400 font-bold ml-1 text-[12px] dark:text-white">
                {fullName}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-black-600 text-15 dark:bg-white" />
          </div>
        </TooltipComponent>

        {/* {isClicked.notification && <Notification />} */}
        {isClicked.userProfile && <UserProfile />}
      </div>
    </div>
    // </div>
  );
};

export default Navbar;
