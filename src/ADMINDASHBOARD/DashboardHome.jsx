import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PieChart from "../pages/Charts/PieChart";
import { useStateContext } from "../contexts/ContextProvider";
import { FcConferenceCall, FcBusinesswoman, FcCurrencyExchange } from "react-icons/fc";
import { BiMaleFemale } from "react-icons/bi";
import Calendar from "../pages/Calendar";
import axios from "axios";
import ActivePieChart from "../pages/Charts/ActivePieChart";
import EarningChart from "../CHART/EarningChart";
import Cookies from "js-cookie";
import TeacherNotice from "../TEACHERDASHBOARD/TeacherNotice";
import { Footer } from "../components";
import useCustomQuery from "../useCustomQuery";
import Loading from "../Loading";
import SomthingwentWrong from "../SomthingwentWrong";

const DashboardHome = () => {
  const authToken = Cookies.get("token");
  const {
    queryData: teacherData,
    error: teacherError,
    loading: teacherLoading,
  } = useCustomQuery(
    "https://eshikshaserver.onrender.com/api/v1/adminRoute/getTeachers"
  );
  const {
    queryData: studentData,
    error: studentError,
    loading: studentLoading,
  } = useCustomQuery(
    "https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents"
  );
  const {
    queryData: admissionData,
    error: admissionError,
    loading: admissionLoading,
  } = useCustomQuery(
    "https://eshikshaserver.onrender.com/api/v1/adminRoute/getLastYearStudents"
  );

  const location = useLocation();
  const navigate = useNavigate();
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [admissionCount, setAdmissionCount] = useState(0);
  const [earningData, setEarningData] = useState([]);
  const [totalSellAmount, setTotalSellAmount] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const { currentColor } = useStateContext();


 

  useEffect(() => {
    if (teacherData) {
      setTeacherCount(teacherData.data.length);
    }
  }, [teacherData]);

  useEffect(() => {
    if (studentData) {
      setStudentCount(studentData.allStudent.length);
    }
  }, [studentData]);

  useEffect(() => {
    if (admissionData) {
      setAdmissionCount(admissionData.count);
    }
  }, [admissionData]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
       
        const response = await axios.get(
          "https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllItems",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (Array.isArray(response.data.listOfAllItems)) {
          const aggregatedSellAmounts = {};

          response.data.listOfAllItems.forEach((item) => {
            const category = capitalize(item.category);
            const sellAmount = parseFloat(item.sellAmount);

            if (aggregatedSellAmounts[category] === undefined) {
              aggregatedSellAmounts[category] = sellAmount;
            } else {
              aggregatedSellAmounts[category] += sellAmount;
            }
          });

          const extractedCategories = Object.keys(aggregatedSellAmounts);
          const extractedAmount = Object.values(aggregatedSellAmounts);

          const totalSellAmount = extractedAmount.reduce(
            (acc, amount) => acc + amount,
            0
          );

          setTotalSellAmount(totalSellAmount);
        }
      } catch (error) {
        console.error("Error fetching item list:", error);
      }
    };

    fetchItems();
  }, [authToken]);

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const fetchFeeStatus = async () => {
      try {
        const response = await axios.get(
          "https://eshikshaserver.onrender.com/api/v1/fees/getFeeStatus",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const totalAmount = response.data?.data;

        let monthlyPaidAmounts = {};

        totalAmount?.forEach((total) => {
          if (total.feeHistory && total.feeHistory.length > 0) {
            total.feeHistory?.forEach((fee) => {
              const paidAmount = Number(fee.paidAmount || 0);
              const month = fee.month;

              if (!monthlyPaidAmounts[month]) {
                monthlyPaidAmounts[month] = { paid: 0, dues: 0 };
              }

              monthlyPaidAmounts[month].paid += paidAmount;
              monthlyPaidAmounts[month].dues += total.dues || 0;
            });
          }
        });

        const paidSeries = Object.values(monthlyPaidAmounts).map(
          (data) => data.paid
        );
        const totalPaid = paidSeries?.reduce(
          (total, amount) => total + amount,
          0
        );
        setTotalPaidAmount(totalPaid);
      } catch (error) {
        console.error("Error fetching Fees data: ", error);
      }
    };

    fetchFeeStatus();
  }, []);

  useEffect(() => {
    const newEarningData = [
      {
        icon: <FcConferenceCall />,
        amount: `${studentCount}`,
        title: "Students",
        iconColor: "#fff",
        iconBg: "rgb(254, 201, 15)",
        pcColor: "red-600",
        redirect: "allstudent",
      },
      {
        icon: <FcBusinesswoman />,
        amount: `${teacherCount}`,
        title: "Teachers",
        iconColor: "#fff",
        iconBg: "rgb(254, 201, 15)",
        pcColor: "green-600",
        redirect: "allteachers",
      },
      {
        icon: <FcCurrencyExchange />,
        amount: `${totalPaidAmount}`,
        // amount: `${totalSellAmount + totalPaidAmount}`,
        title: "Fee",
        iconColor: "#fff",
        iconBg: "rgb(254, 201, 15)",
        pcColor: "green-600",
        redirect: "checkfee",
      },
      {
        icon: <BiMaleFemale />,
        amount: `${admissionCount}`,
        title: "Admission",
        iconColor: "#fff",
        iconBg: "rgb(254, 201, 15)",
        pcColor: "red-600",
        redirect: "admission",
      },
    ];

    setEarningData(newEarningData);
  }, [teacherCount, studentCount, totalPaidAmount, totalSellAmount]);

  useEffect(() => {
    window.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
      }
    });

    navigate(location.href, { replace: true });
    window.addEventListener("popstate", function (event) {
      navigate(location.href, { replace: true });
    });
  }, [navigate]);

  if (teacherError || studentError) {
    return <SomthingwentWrong />;
  }
  if (teacherLoading || studentLoading) {
    return <Loading />;
  }
  return (
    <>
      <div className="sm:mt-20 mt-20 md:mt-0 bg-gray-100">
        <div className="relative">
          {earningData.map((item) => (
            <div className="w-1/2 sm:w-1/4 float-left" key={item.title}>
              <div
                className={`bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-1 m-2 flex justify-center rounded-md hover:bg-${currentColor}`}
                style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
              >
                <Link
                  to={item.redirect}
                  className="bg-white h-44 dark:text-dark dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl text-center text-red font-semibold"
                >
                  <button
                    type="button"
                    style={{
                      color: item.iconColor,
                      background: currentColor,
                    }}
                    className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-2xl"
                  >
                    {item.icon}
                  </button>
                  <p className="mt-3 text-gray-700 dark:text-gray-200">
                    <span className="text-lg font-semibold">{item.amount}</span>
                    <span className={`text-sm text-${item.pcColor} ml-2`}>
                      {item.percentage}
                    </span>
                  </p>
                  <p
                    className="text-xl font-semibold mt-1"
                    style={{ color: currentColor }}
                  >
                    {item.title}
                  </p>
                </Link>
              </div>
            </div>
          ))}

          <div className="clearfix"></div>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 p-3">
          <div
            className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-md  p-3"
            style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
          >
            <EarningChart />
          </div>
          <div
            className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-md  p-3"
            style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
          >
            <TeacherNotice />
          </div>
          <div
            className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-md  p-3 gap-2 flex justify-center items-center flex-col"
            style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
          >
            <div className="p-2">
              <PieChart />
            </div>
            <div className="p-2">
              <ActivePieChart />
            </div>
          </div>
          <div
            className="bg-white dark:text-white dark:bg-secondary-dark-bg rounded-md  p-3"
            style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
          >
            <Calendar />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashboardHome;



// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import PieChart from "../pages/Charts/PieChart";
// import { useStateContext } from "../contexts/ContextProvider";
// import {FcConferenceCall,
//   FcBusinesswoman,
//   FcCurrencyExchange,
// } from "react-icons/fc";
// import { BiMaleFemale } from "react-icons/bi";
// import Calendar from "../pages/Calendar";
// import axios from "axios";
// import ActivePieChart from "../pages/Charts/ActivePieChart";
// import EarningChart from "../CHART/EarningChart";
// import Cookies from "js-cookie";
// import TeacherNotice from "../TEACHERDASHBOARD/TeacherNotice";
// import { Footer } from "../components";
// import useCustomQuery from "../useCustomQuery";
// import Loading from "../Loading";
// import SomthingwentWrong from "../SomthingwentWrong";
// const authToken = Cookies.get("token");
// const DashboardHome = () => {
//   const {
//     queryData: teacherData,
//     error: teacherError,
//     loading: teacherLoading,
//   } = useCustomQuery(
//     "https://eshikshaserver.onrender.com/api/v1/adminRoute/getTeachers"
//   );
//   const {
//     queryData: studentData,
//     error: studentError,
//     loading: studentLoading,
//   } = useCustomQuery(
//     "https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents"
//   );
//   const {
//     queryData: admissionData,
//     error: admissionError,
//     loading: admissionLoading,
//   } = useCustomQuery(
//     "https://eshikshaserver.onrender.com/api/v1/adminRoute/getLastYearStudents"
//   );

//   const location = useLocation();
//   const navigate = useNavigate();
//   const [teacherCount, setTeacherCount] = useState(0);
//   const [studentCount, setStudentCount] = useState(0);
//   const [admissionCount, setAdmissionCount] = useState(0);
//   const [earningData, setEarningData] = useState([]);
//   const [totalSellAmount, setTotalSellAmount] = useState(0);
//   const [totalPaidAmount, setTotalPaidAmount] = useState(0);
//   const { currentColor } = useStateContext();

//   useEffect(() => {
//     if (teacherData) {
//       setTeacherCount(teacherData.data.length);
//     }
//   }, [teacherData]);

//   useEffect(() => {
//     if (studentData) {
//       setStudentCount(studentData.allStudent.length);
//     }
//   }, [studentData]);

//   useEffect(() => {
//     if (admissionData) {
//       setAdmissionCount(admissionData.count);
//     }
//   }, [admissionData]);

//   useEffect(() => {
//     axios
//       .get(
//         "https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllItems",
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         if (Array.isArray(response.data.listOfAllItems)) {
//           const aggregatedSellAmounts = {};

//           response.data.listOfAllItems.forEach((item) => {
//             const category = capitalize(item.category);
//             const sellAmount = parseFloat(item.sellAmount);

//             if (aggregatedSellAmounts[category] === undefined) {
//               aggregatedSellAmounts[category] = sellAmount;
//             } else {
//               aggregatedSellAmounts[category] += sellAmount;
//             }
//           });

//           const extractedCategories = Object.keys(aggregatedSellAmounts);
//           const extractedAmount = Object.values(aggregatedSellAmounts);

//           const totalSellAmount = extractedAmount.reduce(
//             (acc, amount) => acc + amount,
//             0
//           );

//           setTotalSellAmount(totalSellAmount);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching item list:", error);
//       });
//   }, []);

//   const capitalize = (str) => {
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   };

//   useEffect(() => {
//     axios
//       .get(`https://eshikshaserver.onrender.com/api/v1/fees/getFeeStatus`, {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       })
//       .then((response) => {
//         const totalAmount = response.data?.data;

//         let monthlyPaidAmounts = {};

//         totalAmount?.forEach((total) => {
//           if (total.feeHistory && total.feeHistory.length > 0) {
//             total.feeHistory.forEach((fee) => {
//               const paidAmount = Number(fee.paidAmount || 0);
//               const month = fee.month;

//               if (!monthlyPaidAmounts[month]) {
//                 monthlyPaidAmounts[month] = { paid: 0, dues: 0 };
//               }

//               monthlyPaidAmounts[month].paid += paidAmount;
//               monthlyPaidAmounts[month].dues += total.dues || 0;
//             });
//           }
//         });

//         const paidSeries = Object.values(monthlyPaidAmounts).map(
//           (data) => data.paid
//         );
//         const totalPaid = paidSeries?.reduce(
//           (total, amount) => total + amount,
//           0
//         );
//         setTotalPaidAmount(totalPaid);
//       })
//       .catch((error) => {
//         console.error("Error fetching Fees data: ", error);
//       });
//   }, []);

//   useEffect(() => {
//     const newEarningData = [
//       {
//         icon: <FcConferenceCall />,
//         amount: `${studentCount}`,
//         title: "Students",
//         iconColor: "#fff",
//         iconBg: "rgb(254, 201, 15)",
//         pcColor: "red-600",
//         redirect: "allstudent",
//       },
//       {
//         icon: <FcBusinesswoman />,
//         amount: `${teacherCount}`,
//         title: "Teachers",
//         iconColor: "#fff",
//         iconBg: "rgb(254, 201, 15)",
//         pcColor: "green-600",
//         redirect: "allteachers",
//       },
//       {
//         icon: <FcCurrencyExchange />,
//         amount: `${totalSellAmount + totalPaidAmount}`,
//         title: "Fee",
//         iconColor: "#fff",
//         iconBg: "rgb(254, 201, 15)",
//         pcColor: "green-600",
//         redirect: "checkfee",
//       },
//       {
//         icon: <BiMaleFemale />,
//         amount: `${admissionCount}`,
//         title: "Admission",
//         iconColor: "#fff",
//         iconBg: "rgb(254, 201, 15)",
//         pcColor: "red-600",
//         redirect: "admission",
//       },
//     ];

//     setEarningData(newEarningData);
//   }, [teacherCount, studentCount, totalPaidAmount, totalSellAmount]);

//   useEffect(() => {
//     window.addEventListener("keydown", function (event) {
//       if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
//         event.preventDefault();
//       }
//     });

//     navigate(location.href, { replace: true });
//     window.addEventListener("popstate", function (event) {
//       navigate(location.href, { replace: true });
//     });
//   }, [navigate]);

//   if (teacherError || studentError) {
//     return <SomthingwentWrong />;
//   }
//   if (teacherLoading || studentLoading) {
//     return <Loading />;
//   }
//   return (
//     <>
//       <div className="sm:mt-20 mt-20 md:mt-0">
//         <div className="relative  ">
//           {earningData.map((item) => (
//             <div className="w-1/2 sm:w-1/4 float-left ">
//               <div className={`bg-white  dark:text-gray-200 dark:bg-secondary-dark-bg  p-1 m-2 flex justify-center rounded-2xl hover:bg-${currentColor}`}
//                style={{ boxShadow: " rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
//               >
//                 <Link
//                   to={item.redirect}
//                   key={item.title}
                 
//                   className="bg-white h-44 dark:text-dark dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl text-center text-red font-semibold"
//                 >
//                   <button
//                     type="button"
//                     style={{
//                       color: item.iconColor,
//                       background: currentColor,
//                     }}
//                     className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-2xl "
//                   >
//                     {item.icon}
//                   </button>
//                   <p className="mt-3 text-gray-700 dark:text-gray-200 ">
//                     <span className="text-lg font-semibold">{item.amount}</span>
//                     <span className={`text-sm text-${item.pcColor} ml-2`}>
//                       {item.percentage}
//                     </span>
//                   </p>
//                   <p
//                     className="text-xl  font-semibold  mt-1"
//                     style={{ color: currentColor }}
//                   >
//                     {item.title}
//                   </p>
//                 </Link>
//               </div>
//             </div>
//           ))}

//           <div className="clearfix"></div>
//         </div>

//         <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 p-3">
//           <div
//             className="bg-white  dark:text-gray-200 dark:bg-secondary-dark-bg  rounded-2xl p-3"
//             style={{ boxShadow: " rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
//           >
//             <EarningChart />
//           </div>
//           <div
//             className="bg-white  dark:text-gray-200 dark:bg-secondary-dark-bg   rounded-2xl p-3"
//             style={{ boxShadow: " rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
//           >
//             <TeacherNotice />
//           </div>
//           <div
//             className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg   rounded-2xl p-3 gap-2 flex justify-center items-center flex-col"
//             style={{ boxShadow: " rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
//           >
//             <div className="p-2   ">
//               <PieChart />
//             </div>
//             <div className="p-2   ">
//               <ActivePieChart />
//             </div>
//           </div>
//           <div
//             className="bg-white  dark:text-white dark:bg-secondary-dark-bg   rounded-2xl p-3"
//             style={{ boxShadow: " rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
//           >
//             <Calendar />
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };
// export default DashboardHome;
