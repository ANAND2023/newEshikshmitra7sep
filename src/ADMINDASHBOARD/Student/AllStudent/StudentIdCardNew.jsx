import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./Style.css";
import { useStateContext } from "../../../contexts/ContextProvider.js";
import Cookies from "js-cookie";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import { format,parseISO, } from 'date-fns';

import {
  FaGraduationCap,
  FaUser,
  FaBirthdayCake,
  FaFlag,
  FaHome,
  FaMapSigns,
  FaRegCalendar,
  FaPhone,
} from "react-icons/fa";
import { RiParentFill } from "react-icons/ri";
import { IoMail } from "react-icons/io5";
import { PiGenderIntersexBold } from "react-icons/pi";
import { MdOutlineMoney } from "react-icons/md";
const StudentIdCardNew = () => {
  const authToken = Cookies.get("token");
  const { currentColor } = useStateContext();
  const { email } = useParams();
  // const { admissionNumber } = useParams();
  const [studentData, setStudentData] = useState([]);
  const [studentFee, setStudentFee] = useState([]);
  // console.log("studentFee", studentFee.feeHistory);
  const componentPDF = useRef();
  // console.log("firststudentData", studentData);
  const schoolName = sessionStorage.getItem("schoolName");
  const SchoolImage = sessionStorage.getItem("image");
  const schoolContact = sessionStorage.getItem("schoolContact");
  const schoolAddress = sessionStorage.getItem("schooladdress");

  // useEffect(() => {
  //   axios
  //     .get(
  //       `https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents?email=${email}`,
  //       {
  //         withCredentials: true,
  //         headers: {
  //           Authorization: `Bearer ${authToken}`,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       const data = response.data.allStudent[0];
  //       setStudentData(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching Student data:", error);
  //     });
  // }, [email]);
  useEffect(() => {
    axios
      .get(
        `https://eshikshaserver.onrender.com/api/v1/adminRoute/getDataByAdmissionNumber/${email}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        // console.log("firstresponse", response);
        // setStudentData(response.data.studentData);
        // setStudentFee(response.data.feeStatusData);
        setStudentData(response.data.studentData || {});
        setStudentFee(response.data.feeStatusData || {});
      });
  }, []);

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: `${studentData.fullName}'s Id Card`,
    onAfterPrint: () => toast.success("Download Successfully"),
  });

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`action-tabpanel-${index}`}
        aria-labelledby={`action-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </Typography>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `action-tab-${index}`,
      "aria-controls": `action-tabpanel-${index}`,
    };
  }

  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <>
      <div className="  border border-gray-300 w-full flex justify-center items-center">
        <div className="w-[80%] py-2 mx-auto flex justify-end items-center gap-2">
          <Link to="/admin">Dashboard » </Link>
          <Link to="/admin/allstudent">Students » </Link>
          <Link to="" className="text-gray-500">
            Students Details
          </Link>
        </div>
      </div>
      <div class="">
        <div className="px-5 bg-gray-200">
          <div className="py-2 flex flex-row items-center gap-10 ">
            <FaGraduationCap className="text-[30px] text-gray-500" />
            <h1 className="text-xl font-medium text-gray-500 uppercase">
              Student Details
            </h1>
          </div>

          <hr />
        </div>
        <div class="main-bd">
          <div class="right-side ">
            <div class="profile-header">
              <div className=" w-full ">
                <div className=" flex justify-between flex-wrap md:flex-nowrap gap-1">
                  <div className=" w-full py-1 flex flex-row px-5 bg-[#13c4a5]">
                    <div>
                      {studentData.image ? (
                        <img
                          className="w-[90px] h-[90px] object-contain"
                          src={studentData.image?.url}
                          alt="Profile Image"
                        />
                      ) : (
                        <img
                          className="w-[90px] h-[90px] object-contain"
                          src="data:image/png;base64,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"
                          alt="Profile Image"
                        />
                      )}
                    </div>
                    <div className="pl-10">
                      <h3 className="text-white uppercase">{studentData.fullName}</h3>
                      <p className="text-gray-700 uppercase">{studentData.role}</p>
                      <Link
                        to={`/admin/allstudent/editstudent/edit-profile/${studentData.email}`}
                      >
                        <Button variant="contained" className="text-white">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="bg-[#5191d1] w-full py-3 px-5">
                    <h3 className="text-white">STUDENT ID</h3>
                    <p className="text-lg text-white">
                      {studentData.admissionNumber}
                    </p>
                  </div>
                  <div className="bg-[#3fcf7f] w-full py-3 px-5">
                    <h3 className="text-white">CLASS </h3>
                    <p className="text-lg text-white">
                      {studentData.class}-{studentData.section}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Box
              sx={{
                bgcolor: "background.paper",
                position: "relative",
                minHeight: 200,
              }}
            >
              <AppBar position="static" color="default">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="action tabs example"
                >
                  <Tab label="Student Information" {...a11yProps(0)} />
                  <Tab label="Guardians Information" {...a11yProps(1)} />
                  <Tab label="Other Information" {...a11yProps(2)} />
                  <Tab label="Fees Information" {...a11yProps(3)} />
                </Tabs>
              </AppBar>
              <SwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={value}
                onChangeIndex={handleChangeIndex}
              >
                <TabPanel value={value} index={0} dir={theme.direction}>
                  <div className="flex flex-row flex-wrap md:flex-nowrap w-full">
                    <div className="w-full">
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <FaGraduationCap className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Student ID</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            {studentData.admissionNumber}
                          </span>
                        </div>
                      </div>
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <FaUser className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Full Name</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            {studentData.fullName}
                          </span>
                        </div>
                      </div>
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <FaBirthdayCake className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Roll No.</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            {studentData.rollNo}
                          </span>
                        </div>
                      </div>
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <PiGenderIntersexBold className="text-[30px] text-gray-500" />
                        </div>
                       
                        <div className="pl-5">
                          <p className="text-gray-700">Gender</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            {studentData.gender}
                          </span>
                        </div>
                      </div>


                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <FaBirthdayCake className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Date Of Birth</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            {/* {studentData.dateOfBirth} */}
                            {/* { format(parseISO(studentData.dateOfBirth), 'dd--MM-yyyy')} */}
                            {studentData.dateOfBirth ? format(parseISO(studentData.dateOfBirth), 'dd-MM-yyyy') : 'Invalid Date'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <FaPhone className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Number</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            {studentData.contact}
                          </span>
                        </div>
                      </div>
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <IoMail className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Email</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            {studentData.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                    <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <FaRegCalendar className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Date Of Admission</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            {studentData.joiningDate}
                          </span>
                        </div>
                      </div>
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <FaMapSigns className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Current Address</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            {studentData.address},{studentData.city},
                            {studentData.pincode}
                          </span>
                        </div>
                      </div>
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <FaMapSigns className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">State</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            {studentData.state}
                          </span>
                        </div>
                      </div>
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <FaHome className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Country</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            {studentData.country}
                          </span>
                        </div>
                      </div>
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <FaFlag className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Nationality</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            {studentData.nationality}
                          </span>
                        </div>
                      </div>
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <FaHome className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Religion</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            {studentData.religion}
                          </span>
                        </div>
                      </div>
                     
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                  <div className="flex flex-row flex-wrap md:flex-nowrap w-full">
                    <div className="w-full">
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-[11px]">
                          <RiParentFill className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <span className="text-xl text-gray-500 font-semibold">
                            Father's Information
                          </span>
                        </div>
                      </div>
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <FaUser className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Father's Name</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            {studentData.fatherName}
                          </span>
                        </div>
                      </div>
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <FaUser className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Mother's Name</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            {studentData.motherName}
                          </span>
                        </div>
                      </div>
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <FaGraduationCap className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">
                            Parent's Qualification
                          </p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            cdw65
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <MdOutlineMoney className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Parent's Income</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            cdw65
                          </span>
                        </div>
                      </div>

                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <FaPhone className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Parent's Number</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            cdw65
                          </span>
                        </div>
                      </div>
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <IoMail className="text-[30px] text-gray-500" />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Parent's Email</p>
                          <span className="text-xl text-cyan-800 font-semibold">
                            cdw65
                          </span>
                        </div>
                      </div>
                      <div className="border-b-2  flex flex-row ">
                        <div className="py-2">
                          <img
                            src="https://www.shutterstock.com/image-vector/mom-dad-hugging-their-son-260nw-1211168512.jpg"
                            className="w-[70px] h-[70px] object-contain"
                            alt="parents"
                          />
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">Father's Image</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                  Coming soon.....
                </TabPanel>
                <TabPanel value={value} index={3} dir={theme.direction}>
                  <div className=" py-4 ">
                    <div className="inline-block min-w-full shadow-md ">
                      <table className="min-w-full leading-normal">
                        <thead>
                          <tr className=" bg-red-400 p-1">
                            <th className="px-1  py-3 border-b-2 border-r-2 border-gray-200 bg-gray-100 text-left text-[10px] text-bold font-semibold text-gray-700 uppercase tracking-wider">
                              Months
                            </th>
                            <th className="px-1  py-3 border-b-2 border-r-2 border-gray-200 bg-gray-100 text-left text-[10px] text-bold font-semibold text-gray-700 uppercase tracking-wider">
                              Mode
                            </th>
                            <th className="px-1  py-3 border-b-2 border-r-2 border-gray-200 bg-gray-100 text-left text-[10px] text-bold font-semibold text-gray-700 uppercase tracking-wider">
                              Status
                            </th>

                            <th className="px-1  py-3 border-b-2  border-r-2  border-gray-200 bg-gray-100 text-left text-[10px] text-bold font-semibold text-gray-700 uppercase tracking-wider">
                              Amount
                            </th>
                            {/* <th className="px-1  py-3 border-b-2 border-r-2 border-gray-200 bg-gray-100 text-left text-[10px] text-bold font-semibold text-gray-700 uppercase tracking-wider">
                            Discount
                          </th> */}
                            <th className="px-1  py-3 border-b-2 border-r-2 border-gray-200 bg-gray-100 text-left text-[10px] text-bold font-semibold text-gray-700 uppercase tracking-wider">
                              Due Amount
                            </th>
                            <th className="px-1  py-3 border-b-2 border-r-2 border-gray-200 bg-gray-100 text-left text-[10px] text-bold font-semibold text-gray-700 uppercase tracking-wider">
                              Payment Date
                            </th>
                            <th className="px-1  py-3 border-b-2 border-r-2 border-gray-200 bg-gray-100 text-left text-[10px] text-bold font-semibold text-gray-700 uppercase tracking-wider">
                              Receipt Number
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentFee.feeHistory ?  (studentFee.feeHistory.map((fee,index) => (
                              <tr key={index}>
                                <td className="px-1  py-1 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {fee.month}
                                  </p>
                                </td>
                                <td className="px-1  py-1 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {fee.paymentMode}
                                  </p>
                                </td>
                                <td className="px-1  py-1 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {fee.status}
                                  </p>
                                </td>
                                <td className="px-1  py-1 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {fee.paidAmount}
                                  </p>
                                </td>
                                
                                {/* {studentFee?.monthlyDues &&
                                  studentFee.monthlyDues.map((dues)=>(
                                    <td className="px-1  py-1 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                      {dues.dueAmount}
                                    </p>
                                  </td>
                                  ))
                                } */}
                               
                                <td className="px-1  py-1 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {fee.date}
                                  </p>
                                </td>
                                <td className="px-1  py-1 border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {fee.feeReceiptNumber}
                                  </p>
                                </td>
                              </tr>
                            ))):(null)
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabPanel>
              </SwipeableViews>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentIdCardNew;

// import React, { useEffect, useRef, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import "./Style.css";
// import { useStateContext } from "../../../contexts/ContextProvider.js";
// import Cookies from "js-cookie";
// import { useReactToPrint } from "react-to-print";
// import { toast } from "react-toastify";
// import { Button } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import DownloadIcon from "@mui/icons-material/Download";
// import AppBar from "@mui/material/AppBar";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import PropTypes from "prop-types";
// import SwipeableViews from "react-swipeable-views";
// import { useTheme } from "@mui/material/styles";
// const StudentIdCardNew = () => {
//   const authToken = Cookies.get("token");
//   const { currentColor } = useStateContext();
//   const { email } = useParams();
//   const [studentData, setStudentData] = useState({});
//   const componentPDF = useRef();

//   const schoolName = sessionStorage.getItem("schoolName");
//   const SchoolImage = sessionStorage.getItem("image");
//   const schoolContact = sessionStorage.getItem("schoolContact");
//   const schoolAddress = sessionStorage.getItem("schooladdress");

//   useEffect(() => {
//     axios
//       .get(
//         `https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents?email=${email}`,
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         const data = response.data.allStudent[0];
//         setStudentData(data);
//       })
//       .catch((error) => {
//         console.error("Error fetching Student data:", error);
//       });
//   }, [email]);

//   const generatePDF = useReactToPrint({
//     content: () => componentPDF.current,
//     documentTitle: `${studentData.fullName}'s Id Card`,
//     onAfterPrint: () => toast.success("Download Successfully"),
//   });
//   function TabPanel(props) {
//     const { children, value, index, ...other } = props;

//     return (
//       <Typography
//         component="div"
//         role="tabpanel"
//         hidden={value !== index}
//         id={`action-tabpanel-${index}`}
//         aria-labelledby={`action-tab-${index}`}
//         {...other}
//       >
//         {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//       </Typography>
//     );
//   }

//   TabPanel.propTypes = {
//     children: PropTypes.node,
//     index: PropTypes.number.isRequired,
//     value: PropTypes.number.isRequired,
//   };

//   function a11yProps(index) {
//     return {
//       id: `action-tab-${index}`,
//       "aria-controls": `action-tabpanel-${index}`,
//     };
//   }

//   const theme = useTheme();
//   const [value, setValue] = React.useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleChangeIndex = (index) => {
//     setValue(index);
//   };

//   function TabPanel(props) {
//     const { children, value, index, ...other } = props;
//   }
//   return (
//     <>
//       <div className=" h-8 border border-gray-300 w-full flex justify-center items-center">
//         {/* <Link to="/admin/allstudent">
//           <Button
//             variant="contained"
//             startIcon={<ArrowBackIcon />}
//             style={{ backgroundColor: currentColor, color: "white" }}
//           >
//             Back
//           </Button>
//         </Link>
//         <Button
//           variant="contained"
//           onClick={generatePDF}
//           startIcon={<DownloadIcon />}
//           style={{ backgroundColor: currentColor, color: "white" }}
//         >
//           download
//         </Button> */}
//         <div className="w-[80%] mx-auto flex justify-end items-center gap-2">
//         <Link to="/admin">Dashboard »  </Link>
//           <Link to="/admin/allstudent">Students » </Link>
//           <Link to="/admin/allstudent" className="text-gray-500">Students Details</Link>

//         </div>
//       </div>
//       <div class="">

//         <div className="px-5 bg-gray-200">
//           <h1>Student Details</h1>
//           <hr />
//         </div>
//         <div class="main-bd">
//           <div class="left-side">
//             <div class="profile-side">
//               <div class="profile-img">
//                 <img
//                   src="https://fps.cdnpk.net/home/cover/image-14-sm.webp?w=438&h=438"
//                   width="200"
//                   alt="Profile Image"
//                 />
//               </div>
//              <div>
//              <div className=" h-[70vh]">
//                 <h3>Audrey BB Adom</h3>
//                 <p>Student</p>
//                 <Button variant="contained">
//                   Edit
//                 </Button>
//               </div>
//              </div>
//               {/* <p class="mobile-no">
//                 <i class="fa fa-phone"></i> +23470xxxxx700
//               </p>
//               <p class="user-mail">
//                 <i class="fa fa-envelope"></i> Brightisaac80@gmail.com
//               </p> */}
//               {/* <div class="user-bio">
//                 <h3>Bio</h3>
//                 <p class="bio">
//                   Lorem ipsum dolor sit amet, hello how consectetur adipisicing
//                   elit. Sint consectetur provident magni yohoho consequuntur,
//                   voluptatibus ghdfff exercitationem at quis similique. Optio,
//                   amet!
//                 </p>
//               </div>
//               <div class="profile-btn">
//                 <button class="chatbtn" id="chatBtn">
//                   <i class="fa fa-comment"></i> Chat
//                 </button>
//                 <button class="createbtn" id="Create-post">
//                   <i class="fa fa-plus"></i> Create
//                 </button>
//               </div>
//               <div class="user-rating">
//                 <h3 class="rating">4.5</h3>
//                 <div class="rate">
//                   <div class="star-outer">
//                     <div class="star-inner">
//                       <i class="fa fa-star"></i>
//                       <i class="fa fa-star"></i>
//                       <i class="fa fa-star"></i>
//                       <i class="fa fa-star"></i>
//                       <i class="fa fa-star"></i>
//                     </div>
//                   </div>
//                   <span class="no-of-user-rate">
//                     <span>123</span>&nbsp;&nbsp;reviews
//                   </span>
//                 </div>
//               </div> */}
//             </div>
//           </div>

//           <div class="right-side bg-pink-500">
//             <div class="profile-header  ">
//              <div className=" w-full ">
//              <div className="bg-gray-300 p-10"> <h1>Student Reference Number
//              104</h1></div>
//              <div className="bg-lime-300  flex justify-between gap-1">
//               <div className="bg-gray-800 w-full py-3">
//                 <h3 className="text-white">Student ID</h3>
//                 <p className="text-lg text-white">DTI/001/001</p>
//               </div>
//               <div className="bg-gray-800 w-full py-3">
//                 <h3 className="text-white">Student ID</h3>
//                 <p className="text-lg text-white">DTI/001/001</p>
//               </div>
//               <div className="bg-gray-800 w-full py-3">
//                 <h3 className="text-white">Student ID</h3>
//                 <p className="text-lg text-white">DTI/001/001</p>
//               </div>

//              </div>
//              </div>

//             </div>
//             <div class="nav">
//             <Box
//           sx={{
//             bgcolor: "background.paper",
//             position: "relative",
//             minHeight: 200,
//           }}
//         >
//           <AppBar position="static" color="default">
//             <Tabs
//               value={value}
//               onChange={handleChange}
//               indicatorColor="primary"
//               textColor="primary"
//               variant="fullWidth"
//               aria-label="action tabs example"
//             >
//               <Tab label="Theme One" {...a11yProps(0)} />
//               <Tab label="Theme Two" {...a11yProps(1)} />
//               <Tab label="Theme Three" {...a11yProps(2)} />
//             </Tabs>
//           </AppBar>
//           <SwipeableViews
//             axis={theme.direction === "rtl" ? "x-reverse" : "x"}
//             index={value}
//             onChangeIndex={handleChangeIndex}
//           >
//             <TabPanel value={value} index={0} dir={theme.direction}>
//           <div className="bg-lime-400  h-screen">
//           Comming soon.....
//           </div>
//             </TabPanel>
//             <TabPanel value={value} index={1} dir={theme.direction}>
//               Comming soon.....
//             </TabPanel>
//             <TabPanel value={value} index={2} dir={theme.direction}>
//               Comming soon.....
//             </TabPanel>
//           </SwipeableViews>

//         </Box>
//               {/* <ul>
//                 <li onclick="tabs(0)" class="user-post active">
//                   Posts
//                 </li>
//                 <li onclick="tabs(1)" class="user-review">
//                   Reviews
//                 </li>
//                 <li onclick="tabs(2)" class="user-setting">
//                   {" "}
//                   Settings
//                 </li>
//               </ul> */}
//             </div>
//             {/* <div class="profile-body">
//               <div class="profile-posts tab">
//                 <h1>Your Post</h1>
//                 <p>
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa
//                   quia sunt itaque ut libero cupiditate ullam qui velit laborum
//                   placeat doloribus, non tempore nisi ratione error rem minima
//                   ducimus. Accusamus adipisci quasi at itaque repellat sed magni
//                   eius magnam repellendus. Quidem inventore repudiandae sunt
//                   odit. Aliquid facilis fugiat earum ex officia eveniet, nisi,
//                   similique ad ullam repudiandae molestias aspernatur qui autem,
//                   nam? Cupiditate ut quasi iste, eos perspiciatis maiores
//                   molestiae.
//                 </p>
//               </div>
//               <div class="profile-reviews tab">
//                 <h1>User reviews</h1>
//                 <p>
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit.
//                   Aliquam pariatur officia, aperiam quidem quasi, tenetur
//                   molestiae. Architecto mollitia laborum possimus iste esse.
//                   Perferendis tempora consectetur, quae qui nihil voluptas.
//                   Maiores debitis repellendus excepturi quisquam temporibus quam
//                   nobis voluptatem, reiciendis distinctio deserunt vitae! Maxime
//                   provident, distinctio animi commodi nemo, eveniet fugit porro
//                   quos nesciunt quidem a, corporis nisi dolorum minus sit eaque
//                   error sequi ullam. Quidem ut fugiat, praesentium velit
//                   aliquam!
//                 </p>
//               </div>
//               <div class="profile-settings tab">
//                 <div class="account-setting">
//                   <h1>Acount Setting</h1>
//                   <p>
//                     Lorem ipsum dolor sit amet, consectetur adipisicing elit.
//                     Reprehenderit omnis eaque, expedita nostrum, facere libero
//                     provident laudantium. Quis, hic doloribus! Laboriosam nemo
//                     tempora praesentium. Culpa quo velit omnis, debitis maxime,
//                     sequi animi dolores commodi odio placeat, magnam, cupiditate
//                     facilis impedit veniam? Soluta aliquam excepturi illum natus
//                     adipisci ipsum quo, voluptatem, nemo, commodi, molestiae
//                     doloribus magni et. Cum, saepe enim quam voluptatum vel
//                     debitis nihil, recusandae, omnis officiis tenetur, ullam
//                     rerum.
//                   </p>
//                 </div>
//               </div>
//             </div> */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StudentIdCardNew;

// import React, { useEffect, useRef, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import { useStateContext } from "../../../contexts/ContextProvider.js";
// import Cookies from "js-cookie";
// import { useReactToPrint } from "react-to-print";
// import { toast } from "react-toastify";
// import { Button } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import DownloadIcon from '@mui/icons-material/Download';
// const StudentIdCardNew = () => {
//   const authToken = Cookies.get("token");
//   const { currentColor } = useStateContext();
//   const { email } = useParams();
//   const [studentData, setStudentData] = useState({});
//   const componentPDF = useRef();

//   const schoolName = sessionStorage.getItem("schoolName");
//   const SchoolImage = sessionStorage.getItem("image");
//   const schoolContact = sessionStorage.getItem("schoolContact");
//   const schoolAddress = sessionStorage.getItem("schooladdress");

//   useEffect(() => {
//     axios
//       .get(
//         `https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents?email=${email}`,
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         const data = response.data.allStudent[0];
//         setStudentData(data);
//       })
//       .catch((error) => {
//         console.error("Error fetching Student data:", error);
//       });
//   }, [email]);

//   const generatePDF = useReactToPrint({
//     content: () => componentPDF.current,
//     documentTitle: `${studentData.fullName}'s Id Card`,
//     onAfterPrint: () => toast.success("Download Successfully"),
//   });

//   return (
//     <>
//     <div className="flex justify-between w-[90%] mx-auto">
//      <Link to="/admin/allstudent">
//         <Button
//           variant="contained"
//           startIcon={<ArrowBackIcon />}
//           style={{ backgroundColor: currentColor, color: "white" }}
//         >
//           Back
//         </Button>
//       </Link>
//       <Button
//           variant="contained"
//           onClick={generatePDF}
//           startIcon={<DownloadIcon />}
//           style={{ backgroundColor: currentColor, color: "white" }}
//         >
//           download
//         </Button>
//      </div>
//       <div className="flex justify-center" ref={componentPDF}>
//         <div className="border-2 border-blue-400 w-72 relative rounded-lg p-2">
//           <div>
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
//               <path
//                 fill="#0099ff"
//                 fill-opacity="1"
//                 d="M0,128L720,320L1440,96L1440,0L720,0L0,0Z"
//               ></path>
//             </svg>
//             <p className="absolute top-3 right-3 text-white text-xs">
//               IDENTITY CARD
//             </p>
//             <div className="w-14 h-14 rounded-full border-2 border-white absolute top-3 ms-10 overflow-hidden">
//               <img className="w-[100%] h-[100%] " src={SchoolImage} />
//             </div>
//             <div>
//               <h1 className="text-blue-400  font-bold text-xl text-center">
//                 {schoolName}
//               </h1>
//             </div>
//             <div className="text-center bg-blue-300 pt-[2px] pb-2 mt-2 px-5">
//               <p className="text-gray-700 font-bold text-[10px]">
//                 {schoolAddress} <br /> <span>Tel: +91{schoolContact} </span>
//               </p>
//             </div>
//           </div>
//           <div className="flex ">
//             <div className=" border-blue-300 mt-2  ms-2 overflow-hidden">
//               {studentData.image && studentData.image.url ? (
//                 <img
//                   className="w-24 h-auto  border-1 rounded-md"
//                   src={studentData.image.url}
//                   alt="Image"
//                 />
//               ) : (
//                 <p>No image available</p>
//               )}
//             </div>
//             <div className="ms-4 w-[50%] dark:text-white">
//               <p className="font-bold">
//                 Name : <br />
//               </p>
//               <span> {studentData.fullName?.slice(0, 15)}</span>
//               <p className="font-bold">
//                 F/Name : <br />
//               </p>
//               <span>{studentData.fatherName}</span>
//               <p>
//                 <span className="font-bold ">Class:</span> {studentData.class}-
//                 {studentData.section}
//               </p>
//               <p>
//                 <span className="font-bold ">D.O.B:</span>
//                 {new Date(studentData.dateOfBirth).toLocaleDateString("en-US")}
//               </p>
//             </div>
//           </div>
//           <div className="mt-2">
//             <div className="mb-6 dark:text-white text-[10px]">
//               <p className="ms-4 font-bold ">Address : {studentData.address}</p>
//               <p className="ms-4 font-bold ">Tel : +91{studentData.contact} </p>
//             </div>
//             <p className="dark:text-white font-bold absolute bottom-2 right-2 text-gray-400">
//               Principal
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StudentIdCardNew;
