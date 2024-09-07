// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { toast } from "react-toastify";
// import { useStateContext } from "../../contexts/ContextProvider";
// import Modal from "react-modal";
// import AOS from "aos";
// import "./index.css";
// import "aos/dist/aos.css";
// import "./Card.css";
// import Select from "react-select";

// const NewCheckFee = () => {
//   const [selectedChildren, setSelectedChildren] = useState([]);
//   const [allStudent, setAllStudent] = useState([]);
//   const [dues, setDues] = useState(0);
//   const [feeValues, setFeeValues] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [allFees, setAllFees] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [parentData, setParentData] = useState([]);
//   const [isRegularFeeChecked, setIsRegularFeeChecked] = useState(false);
//   const [isAdditionalFeeChecked, setIsAdditionalFeeChecked] = useState(false);
//   const [feeAmount, setFeeAmount] = useState();
//   const { currentColor } = useStateContext();
//   const [getFee, setGetFee] = useState({});
//   const [AdditionalFees, setAdditionalFees] = useState([]);
//   const [selectedAdditionalFees, setSelectedAdditionalFees] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [modalIsOpen, setModalIsOpen] = useState(false);

//   const getCurrentDate = () => {
//     const today = new Date();
//     return today.toISOString().split("T")[0];
//   };
//   const [formData, setFormData] = useState({
//     admissionNumer: "",
//     classFee: getFee,
//     feeAmount: feeAmount,
//     FeeMonth: "",
//     feeDate: getCurrentDate(),
//     feeStatus: "Paid",
//     paymentMode: "Online",
//     transactionId: "",
//     chequeBookNo: "",
//     preDues: "",
//   });
//   const authToken = Cookies.get("token");

//   const toggleModal = () => {
//     setIsOpen(!isOpen);
//   };

//   const getCurrentMonth = () => {
//     const today = new Date();
//     const month = today.toLocaleString("default", { month: "long" });
//     return month;
//   };


//   useEffect(() => {
//     axios
//       .get(
//         "https://eshikshaserver.onrender.com/api/v1/adminRoute/getAdditionalFees",
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         console.log("getAdditionalFees", response);
//         const feesData = response.data.map((fee) => {
//           const label =
//             fee.name && fee.amount
//               ? `${fee.name} (${fee.amount})`
//               : "Unknown Fee";
//           const value = fee.amount ? fee.amount.toString() : "0";

//           return {
//             label,
//             value,
//           };
//         });

//         setAdditionalFees(feesData);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   }, []);


//   useEffect(() => {
//     axios
//       .get("https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllFees", {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       })
//       .then((response) => {
//         const feesData = response.data.map((fee) => {
//           const label =
//             fee.name && fee.amount
//               ? `${fee.name} (${fee.amount})`
//               : "Unknown Fee";
//           const value = fee.amount ? fee.amount.toString() : "0";

//           return {
//             label,
//             value,
//           };
//         });

//         setAllFees(feesData);
//       });
//   }, [authToken]);
//   const handleChildSelection = (childIndex) => {
//     setSelectedChildren((prevSelected) =>
//       prevSelected.includes(childIndex)
//         ? prevSelected.filter((index) => index !== childIndex)
//         : [...prevSelected, childIndex]
//     );

//     if (Array.isArray(formData)) {
//       const updatedFormData = [...formData];
//       updatedFormData[childIndex] = {
//         ...updatedFormData[childIndex],
//         totalAmount: 0,
//         additionalFeeValues: [],
//       };
//       setFormData(updatedFormData);
//     } else {
//       console.error("formData is not an array.");
//     }
//   };

//   const handleSearch = (event) => {
//     const searchValue = event.target.value.toLowerCase().trim();
//     setSearchTerm(searchValue);
//     if (searchValue === "") {
//       setFilteredStudents([]);
//     } else {
//       const filtered = allStudent.filter(
//         (student) =>
//           student.fullName &&
//           student.fullName.toLowerCase().includes(searchValue)
//       );
//       setFilteredStudents(filtered);
//     }
//   };


//   useEffect(() => {
//     const totalFee = feeValues.reduce((total, value) => total + value, 0);
//     const totalAmount = formData.length > 0 ? formData[0]?.totalAmount || 0 : 0;
//     setDues(totalFee - totalAmount);
//   }, [feeValues, formData]);
//   //   new code

//   const [previousDues, setPreviousDues] = useState(0);
//   const [selectedMonths, setSelectedMonths] = useState([getCurrentMonth()]);
//   const handleDateChange = (e) => {
//     setFormData({ ...formData, feeDate: e.target.value });
//   };
//   const handleCheckboxChange = (e) => {
//     const { name, checked } = e.target;
//     if (name === "regularFee") {
//       setIsRegularFeeChecked(checked);
//     } else if (name === "additionalFee") {
//       setIsAdditionalFeeChecked(checked);
//     }
//   };
//   const totalAmount = () => {
//     return getTotalPaidAmount() + previousDues;
//   };
//   const handleStudentClick = (admissionNumber) => {
//     axios
//       .get(
//         `https://eshikshaserver.onrender.com/api/v1/adminRoute/getParentWithChildren/${admissionNumber}`,
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         const children = response.data.children;
//         setParentData(children);
//         const initialFormData = children.map((child) => ({
//           admissionNumber: child.admissionNumber,
//           selectedMonths: [getCurrentMonth()],
//           feeDate: getCurrentDate(),
//           feeStatus: "Paid",
//           paymentMode: "Online",
//           selectedAdditionalFees: [],
//           additionalFeeValues: [],
//           totalAmount: 0,
//         }));

//         setFormData(initialFormData);
//         setIsOpen(true);
//       });
//   };


//   useEffect(() => {
//     axios
//       .get(
//         "https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents",
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         setAllStudent(response.data.allStudent);
//       });
//   }, [authToken]);
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const dataToPost = {};

//     if (isRegularFeeChecked) {
//       dataToPost.classFee = formData.classFee;
//       dataToPost.amountSubmitted = formData.amountSubmitted;
//     }

//     if (isAdditionalFeeChecked) {
//       dataToPost.additionalFees = selectedAdditionalFees.map((fee) => ({
//         feeId: fee.value,
//         paidAmount: additionalFeeValues[fee.value] || 0,
//       }));
//     }

//     // Add other necessary form data
//     dataToPost.feeStatus = formData.feeStatus;
//     dataToPost.paymentMode = formData.paymentMode;
//     dataToPost.feeDate = formData.feeDate;

//     const dues = getTotalDuesAmount;
//     const feeStatus = dues === 0 ? "Paid" : "Unpaid";

//     const additionalFeesArray = selectedAdditionalFees.map((fee) => ({
//       feeName: fee.label.split(" ")[0], // Extract the fee name from the label
//       paidAmount: additionalFeeValues[fee.value] || 0, // Get the amount from the additionalFeeValues
//     }));
//     const newExamData = {
//       admissionNumber: selectedStudent.admissionNumber,
//       className: selectedStudent.class,
//       status: feeStatus,
//       date: formData.feeDate,
//       reMark: formData.reMark,
//       preDues: formData.preDues,
//       paymentMode: formData.paymentMode,
//       totalAmount: totalAmount(),

//       dues: getTotalDuesAmount(),
//       months: selectedMonths, // Posting the months array separately
//     };

//     // Conditionally add `regularFee` if it contains data
//     if (formData.classFee) {
//       newExamData.regularFee = {
//         paidAmount: formData.classFee,
//       };
//     }
//     if (formData.transactionId) {
//       newExamData.transactionId = formData.transactionId;
//     }
//     if (formData.chequeBookNo) {
//       newExamData.chequeBookNo = formData.chequeBookNo;
//     }

//     // Conditionally add `additionalFee` if there are selected additional fees
//     if (selectedAdditionalFees.length > 0) {
//       newExamData.additionalFee = selectedAdditionalFees.map((fee) => ({
//         feeName: fee.label,
//         paidAmount: additionalFeeValues[fee.value] || 0, // Get the amount from additionalFeeValues state
//       }));
//     }

//     const apiUrl =
//       "https://eshikshaserver.onrender.com/api/v1/fees/createFeeStatus";
//     axios
//       .post(apiUrl, newExamData, {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       })
//       .then((response) => {
//         toast.success(response.data.message);
//         getFeeHistory();
//       })
//       .catch((error) => {
//         console.error("Error Posting Data: ", error);
//         toast.error(error.response.data.message);
//       });

//     setModalIsOpen(false);
//   };

//   const handleMonthsChange = (selectedOptions) => {
//     setSelectedMonths(selectedOptions.map((option) => option.value));
//   };

//   const [additionalFeeValues, setAdditionalFeeValues] = useState({});

//   const handleAdditionalFeesChange = (selectedOptions) => {
//     setSelectedAdditionalFees(selectedOptions);

//     // Update the additionalFeeValues state with default values
//     const newAdditionalFeeValues = {};
//     selectedOptions.forEach((fee) => {
//       newAdditionalFeeValues[fee.value] =
//         parseFloat(fee.label.match(/\((\d+)\)/)?.[1]) || 0;
//     });

//     setAdditionalFeeValues(newAdditionalFeeValues);
//   };

//   const handleAdditionalFeeValueChange = (feeKey, value) => {
//     setAdditionalFeeValues((prevValues) => ({
//       ...prevValues,
//       [feeKey]: value, // Here feeKey is the unique key for each additional fee and value is the amount entered
//     }));
//   };
//   const closeModal = () => {
//     setModalIsOpen(false);
//     setSelectedStudent(null);
//   };
//   useEffect(() => {
//     AOS.init({
//       easing: "linear",
//     });
//   }, []);

//   const getTotalFeesAmount = () => {
//     const regularFeesAmount = isRegularFeeChecked
//       ? getFee * selectedMonths.length
//       : 0;

//     const additionalFeesAmount = isAdditionalFeeChecked
//       ? selectedAdditionalFees.reduce(
//           (total, fee) => total + (parseFloat(fee.value) || 0),
//           0
//         )
//       : 0;

//     const totalAmount = regularFeesAmount + additionalFeesAmount + previousDues;

//     return totalAmount;
//   };

//   // Calculate total amount paid
//   const getTotalPaidAmount = () => {
//     const regularFeePaid = isRegularFeeChecked
//       ? parseFloat(formData.classFee)
//       : 0;
//     const additionalFeesPaid = selectedAdditionalFees.reduce(
//       (total, fee) => total + (additionalFeeValues[fee.value] || 0),
//       0
//     );
//     return regularFeePaid + additionalFeesPaid;
//   };

//   const getTotalDuesAmount = () => {
//     const totalFees = getTotalFeesAmount();
//     const totalPaid = getTotalPaidAmount();
//     return totalFees - totalPaid - previousDues;
//   };

//   const feeDisplay =
//     typeof getFee === "object" ? JSON.stringify(getFee) : getFee;
//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search by name"
//         value={searchTerm}
//         onChange={handleSearch}
//         className="p-2 border border-gray-300 rounded mb-4"
//       />
//       {filteredStudents.length > 0 && (
//         <div className="max-h-60 overflow-y-auto border border-gray-300 rounded">
//           {filteredStudents.map((student, index) => (
//             <div
//               key={index}
//               className="p-2 border-b cursor-pointer hover:bg-gray-100"
//               onClick={() => handleStudentClick(student.parentAdmissionNumber)}
//             >
//               {student.fullName || "No Name"}, {student.class},{" "}
//               {student.fatherName}, {student.admissionNumber}
//             </div>
//           ))}
//         </div>
//       )}
//       {isOpen && (
//         <div
//           id="default-modal"
//           tabIndex="-1"
//           aria-hidden="true"
//           className="fixed top-0 right-0 left-0 z-[99999999] flex justify-center items-center w-full h-screen bg-gray-900 bg-opacity-50"
//         >
//           <div className="relative p-4 w-full max-h-full" data-aos="fade-down">
//             <div className="relative bg-gray-600 rounded-lg shadow dark:bg-gray-700">
//               <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                   Fees Form
//                 </h3>
//                 <button
//                   onClick={toggleModal}
//                   type="button"
//                   className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
//                 >
//                   <svg
//                     aria-hidden="true"
//                     className="w-3 h-3"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M6 18L18 6M6 6l12 12"
//                     ></path>
//                   </svg>
//                   <span className="sr-only">Close modal</span>
//                 </button>
//               </div>
//               <form onSubmit={handleSubmit}>
//                 <div className="flex-col justify-start p-5">
//                   {parentData.map((child, index) => (
//                     <div
//                       key={index}
//                       className={`p-4 mb-4 border ${
//                         selectedChildren.includes(index)
//                           ? "border-blue-500"
//                           : "border-gray-300"
//                       } rounded-lg`}
//                     >
//                       <h4 className="text-lg font-semibold mb-2">
//                         {child.fullName} ({child.class})
//                       </h4>

//                       <label className="flex items-center mb-4">
//                         <input
//                           type="checkbox"
//                           checked={selectedChildren.includes(index)}
//                           onChange={() => handleChildSelection(index)}
//                           className="form-checkbox"
//                         />
//                         <span className="ml-2">Select Child</span>
//                       </label>

//                       {selectedChildren.includes(index) && (
//                         <>
//                           {/* <div>
// <p>
//   <strong>Total Fee Amount:</strong> {formData[index]?.totalAmount} 
//   </p>
//   <p>
//   <strong>Stored Fee Values:</strong>
 
//     {feeValues.map((value, idx) => (
//       <span key={idx}>{value}</span>
//     ))}

 
  
// </p>
// <span className="text-red-500">
//         Dues RS. {dues}
//       </span>
//     </div> */}

//                           <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-5">
//                             <div className="flex items-center mb-4">
//                               <input
//                                 type="checkbox"
//                                 name="regularFee"
//                                 checked={isRegularFeeChecked}
//                                 onChange={handleCheckboxChange}
//                               />
//                               <label className="ml-2 text-white">
//                                 Regular Fee
//                               </label>
//                             </div>

//                             {/* Regular Fee Inputs */}
//                             {isRegularFeeChecked && (
//                               <>
//                                 <h2 className="text-white">
//                                   Class Fee: {feeDisplay} ,{" "}
//                                 </h2>
//                                 <div className="flex justify-between">
//                                   <div className="md:mb-4">
//                                     <label className="block text-white">
//                                       Regular Fee
//                                     </label>
//                                     <input
//                                       type="number"
//                                       className="w-full border rounded-lg p-2 dark:bg-secondary-dark-bg dark:text-white"
//                                       value={formData.classFee}
//                                       onChange={(e) =>
//                                         setFormData({
//                                           ...formData,
//                                           classFee: e.target.value,
//                                         })
//                                       }
//                                     />
//                                   </div>
//                                 </div>
//                               </>
//                             )}

//                             {/* Additional Fee Checkbox */}
//                             <div className="flex items-center mb-4">
//                               <input
//                                 type="checkbox"
//                                 name="additionalFee"
//                                 checked={isAdditionalFeeChecked}
//                                 onChange={handleCheckboxChange}
//                               />
//                               <label className="ml-2 text-white">
//                                 Additional Fee
//                               </label>
//                             </div>

//                             {/* Additional Fee Inputs */}
//                             {isAdditionalFeeChecked && (
//                               <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
//                                 <div>
//                                   <label className="block text-white">
//                                     Additional Fees
//                                   </label>
//                                   <Select
//                                     id="additional-fees"
//                                     options={AdditionalFees}
//                                     value={selectedAdditionalFees}
//                                     onChange={handleAdditionalFeesChange}
//                                     isMulti
//                                     placeholder="Select additional fees"
//                                   />
//                                 </div>

//                                 {selectedAdditionalFees.map((fee) => (
//                                   <div key={fee.value} className="md:mb-4">
//                                     <label className="block text-white">
//                                       {fee.label}
//                                     </label>
//                                     <input
//                                       type="number"
//                                       className="w-full border rounded-lg p-2 dark:bg-secondary-dark-bg dark:text-white"
//                                       value={
//                                         additionalFeeValues[fee.value] || ""
//                                       }
//                                       onChange={(e) =>
//                                         handleAdditionalFeeValueChange(
//                                           fee.value,
//                                           parseFloat(e.target.value) || 0
//                                         )
//                                       }
//                                     />
//                                   </div>
//                                 ))}
//                               </div>
//                             )}

//                             {/* Other form inputs */}
//                             <div className="">
//                               <label className="block text-white dark:text-white">
//                                 Months
//                               </label>
//                               <Select
//                                 className="dark:bg-secondary-dark-bg"
//                                 options={[
//                                   "January",
//                                   "February",
//                                   "March",
//                                   "April",
//                                   "May",
//                                   "June",
//                                   "July",
//                                   "August",
//                                   "September",
//                                   "October",
//                                   "November",
//                                   "December",
//                                 ].map((month) => ({
//                                   value: month,
//                                   label: month,
//                                 }))}
//                                 value={selectedMonths.map((month) => ({
//                                   value: month,
//                                   label: month,
//                                 }))}
//                                 onChange={handleMonthsChange}
//                                 isMulti
//                                 placeholder="Select months"
//                               />
//                             </div>

//                             <div className="">
//                               <label className="block text-white">
//                                 Fee Status
//                               </label>
//                               <select
//                                 className="w-full border rounded-lg p-2 dark:bg-secondary-dark-bg dark:text-white"
//                                 value={formData.feeStatus || "Unpaid"}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     feeStatus: e.target.value,
//                                   })
//                                 }
//                               >
//                                 <option className="dark:bg-secondary-dark-bg dark:text-white">
//                                   Select Status
//                                 </option>
//                                 <option
//                                   value="Paid"
//                                   className="dark:bg-secondary-dark-bg dark:text-white"
//                                 >
//                                   Paid
//                                 </option>
//                                 <option
//                                   value="Unpaid"
//                                   className="dark:bg-secondary-dark-bg dark:text-white"
//                                 >
//                                   Unpaid
//                                 </option>
//                               </select>
//                             </div>

//                             <div className="">
//                               <label className="block text-white">
//                                 Payment Mode
//                               </label>
//                               <select
//                                 className="w-full border rounded-lg p-2"
//                                 value={formData.paymentMode || "Cash"}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     paymentMode: e.target.value,
//                                   })
//                                 }
//                               >
//                                 <option value="Cash">Cash</option>
//                                 <option value="Online">Online</option>
//                                 <option value="Cheque">Cheque</option>
//                               </select>
//                             </div>

//                             {/* Transaction ID Field */}
//                             {formData.paymentMode === "Online" && (
//                               <div className="md:mb-4 m-0">
//                                 <label className="block text-white">
//                                   Transaction ID
//                                 </label>
//                                 <input
//                                   type="text"
//                                   className="w-full border rounded-lg p-2"
//                                   value={formData.transactionId || ""}
//                                   onChange={(e) =>
//                                     setFormData({
//                                       ...formData,
//                                       transactionId: e.target.value,
//                                     })
//                                   }
//                                 />
//                               </div>
//                             )}

//                             {/* Cheque Book No Field */}
//                             {formData.paymentMode === "Cheque" && (
//                               <div className="md:mb-4 m-0">
//                                 <label className="block text-white">
//                                   Cheque Book No
//                                 </label>
//                                 <input
//                                   type="text"
//                                   className="w-full border rounded-lg p-2"
//                                   value={formData.chequeBookNo || ""}
//                                   onChange={(e) =>
//                                     setFormData({
//                                       ...formData,
//                                       chequeBookNo: e.target.value,
//                                     })
//                                   }
//                                 />
//                               </div>
//                             )}

//                             <div className="md:mb-4 m-0">
//                               <label className="block text-white">
//                                 Fee Date
//                               </label>
//                               <input
//                                 type="date"
//                                 className="w-full border rounded-lg p-2"
//                                 value={formData.feeDate}
//                                 onChange={handleDateChange}
//                               />
//                             </div>

//                             <div className="md:mb-4 m-0">
//                               <label className="block text-white">
//                                 Total Amount
//                               </label>
//                               <input
//                                 type="text"
//                                 className="w-full border rounded-lg p-2"
//                                 value={totalAmount()}
//                                 readOnly
//                               />
//                             </div>
//                             <div className="md:mb-4 m-0">
//                               <label className="block text-white">Remark</label>
//                               <input
//                                 type="text"
//                                 className="w-full border rounded-lg p-2"
//                                 value={formData.reMark}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     reMark: e.target.value,
//                                   })
//                                 }
//                               />
//                             </div>
//                             <div className="md:mb-4 m-0">
//                               <label className="block text-white">
//                                 Pre Dues Paid
//                               </label>
//                               <input
//                                 type="text"
//                                 className="w-full border rounded-lg p-2"
//                                 value={formData.preDues}
//                                 onChange={(e) =>
//                                   setFormData(
//                                     {
//                                       ...formData,
//                                       preDues: e.target.value,
//                                     },
//                                     setPreviousDues(
//                                       parseFloat(e.target.value) || 0
//                                     )
//                                   )
//                                 }
//                               />
//                             </div>

//                             <p className="text-white font-bold">
//                               Total Fees Amount: {getTotalFeesAmount()}
//                             </p>

//                             <p className="text-white font-bold">
//                               Total Dues: {getTotalDuesAmount()}
//                             </p>

//                             <div className="text-right space-x-3">
//                               <button
//                                 type="submit"
//                                 className="dark:text-white dark:bg-secondary-dark-bg text-gray-800 neu-btn border-2 mb-2"
//                               >
//                                 Submit
//                               </button>
//                               <button
//                                 onClick={closeModal}
//                                 className="dark:text-white dark:bg-secondary-dark-bg text-gray-800 neu-btn border-2 mb-2 border-gray-500"
//                               >
//                                 Close
//                               </button>
//                             </div>
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <div className="flex justify-end p-4 border-t dark:border-gray-600 w-full">
//                   <button
//                     type="submit"
//                     className="px-4 py-2  bg-blue-600 text-white rounded w-full"
//                   >
//                     Submit Fees
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NewCheckFee;



// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import Select from "react-select";
// import { toast } from "react-toastify";

// const NewCheckFee = () => {
//   const [selectedChildren, setSelectedChildren] = useState([]);
//   const [allStudent, setAllStudent] = useState([]);
// const [paidAmount,setPaidAmount]=useState(0)
// const [dues, setDues] = useState(0);
// const [feeValues, setFeeValues] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [allFees, setAllFees] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [parentData, setParentData] = useState([]);
//   const [formData, setFormData] = useState([]);
//   const authToken = Cookies.get("token");

//   const toggleModal = () => {
//     setIsOpen(!isOpen);
//   };

//   const getCurrentMonth = () => {
//     const today = new Date();
//     const month = today.toLocaleString("default", { month: "long" });
//     return month;
//   };

//   const getCurrentDate = () => {
//     const today = new Date();
//     return today.toISOString().split("T")[0];
//   };

//   useEffect(() => {
//     axios
//       .get(
//         "https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents",
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         setAllStudent(response.data.allStudent);
//       });
//   }, [authToken]);

//   useEffect(() => {
//     axios
//       .get("https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllFees", {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       })
//       .then((response) => {
//         const feesData = response.data.map((fee) => {
//           const label =
//             fee.name && fee.amount
//               ? `${fee.name} (${fee.amount})`
//               : "Unknown Fee";
//           const value = fee.amount ? fee.amount.toString() : "0";

//           return {
//             label,
//             value,
//           };
//         });

//         setAllFees(feesData);
//       });
//   }, [authToken]);

//   const handleChildSelection = (childIndex) => {
//     setSelectedChildren((prevSelected) =>
//       prevSelected.includes(childIndex)
//         ? prevSelected.filter((index) => index !== childIndex)
//         : [...prevSelected, childIndex]
//     );

//     // Reset the total amount to 0 when the child is selected or deselected
//     const updatedFormData = [...formData];
//     updatedFormData[childIndex].totalAmount = 0;
//     updatedFormData[childIndex].additionalFeeValues = [];
//     setFormData(updatedFormData);
//   };

//   const handleSearch = (event) => {
//     const searchValue = event.target.value.toLowerCase().trim();
//     setSearchTerm(searchValue);
//     if (searchValue === "") {
//       setFilteredStudents([]);
//     } else {
//       const filtered = allStudent.filter(
//         (student) =>
//           student.fullName &&
//           student.fullName.toLowerCase().includes(searchValue)
//       );
//       setFilteredStudents(filtered);
//     }
//   };

//   const handleStudentClick = (admissionNumber) => {
//     axios
//       .get(
//         `https://eshikshaserver.onrender.com/api/v1/adminRoute/getParentWithChildren/${admissionNumber}`,
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         const children = response.data.children;
//         setParentData(children);
//         const initialFormData = children.map((child) => ({
//           admissionNumber: child.admissionNumber,
//           selectedMonths: [getCurrentMonth()],
//           feeDate: getCurrentDate(),
//           feeStatus: "Paid",
//           paymentMode: "Online",
//           selectedAdditionalFees: [],
//           additionalFeeValues: [],
//           totalAmount: 0,
//         }));

//         setFormData(initialFormData);
//         setIsOpen(true);
//       });
//   };

//   const handleInputChange = (index, field, value) => {
//     const updatedFormData = [...formData];
//     updatedFormData[index][field] = value;
//     setFormData(updatedFormData);
//   };

//   const handleAdditionalFeesChange = (index, selectedOptions) => {
//     const updatedFormData = [...formData];
//     updatedFormData[index].selectedAdditionalFees = selectedOptions;

//     // Extract and store fee values
//     const updatedFeeValues = selectedOptions.map((option) => {
//       // Extract the numeric value from the label (e.g., "examFee (200)")
//       const valueMatch = option.label.match(/\((\d+)\)/);
//       const value = valueMatch ? parseFloat(valueMatch[1]) : 0;
//       return {
//         fee: option.label,
//         value: value,
//       };
//     });

//     updatedFormData[index].additionalFeeValues = updatedFeeValues;

//     // Calculate the new total amount
//     const totalAmount = updatedFeeValues.reduce(
//       (total, feeData) => total + feeData.value,
//       0
//     );
//     updatedFormData[index].totalAmount = totalAmount;

//     // Update the state
//     setFeeValues(updatedFeeValues.map(feeData => feeData.value)); // Store the fee values
//     setFormData(updatedFormData);
//   };

// const handleFeeValueChange = (index, fee, value) => {
//     const updatedFormData = [...formData];
//     const feeValues = updatedFormData[index].additionalFeeValues.map((item) =>
//       item.fee === fee ? { ...item, value: parseFloat(value) || 0 } : item
//     );

//     updatedFormData[index].additionalFeeValues = feeValues;
//     // Calculate the total amount
//     const totalAmount = feeValues.reduce(
//       (total, feeData) => total + parseFloat(feeData.value) || 0,
//       0
//     );
//     updatedFormData[index].totalAmount = totalAmount;
//     setPaidAmount(totalAmount);
//     setFormData(updatedFormData);
//   };

//   useEffect(() => {
//     // Update dues whenever feeValues or formData changes
//     const totalFee = feeValues.reduce((total, value) => total + value, 0);
//     // Assuming you want to handle the case where formData might be empty or not indexed
//     const totalAmount = formData.length > 0 ? formData[0]?.totalAmount || 0 : 0;
//     setDues(totalFee - totalAmount);
//   }, [feeValues, formData]); // Removed index from dependency array

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     selectedChildren.forEach((childIndex) => {
//       const child = parentData[childIndex];
//       const childFormData = formData[childIndex];
//       if (childFormData.selectedMonths.length === 0) {
//         alert(
//           `Please select at least one month for regular fees for ${child.fullName}.`
//         );
//         return;
//       }

//       const feeStatus =
//         childFormData.totalAmount === 0 ? "Unpaid" : "Paid";
//       const feeHistoryData = childFormData.selectedMonths.map((month) => ({
//         paidAmount: childFormData.additionalFeeValues.map((feeData) => ({
//           name: feeData.fee,
//           amount: feeData.value,
//         })),
//         month: month,
//         status: feeStatus,
//         date: childFormData.feeDate,
//         paymentMode: childFormData.paymentMode,
//       }));

//       const newFeeData = {
//         admissionNumber: child.admissionNumber,
//         className: child.class,
//         feeHistory: feeHistoryData,
//         totalAmount: paidAmount,
//         dues: dues, // Include dues
//       };

//       axios
//         .post(
//           "https://eshikshaserver.onrender.com/api/v1/fees/createFeeStatus",
//           newFeeData,
//           {
//             withCredentials: true,
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//             },
//           }
//         )
//         .then((response) => {
//           toast.success(
//             `Fee created for ${child.fullName}: ${response.data.message}`
//           );
//         })
//         .catch((error) => {
//           console.error("Error Posting Data: ", error);
//           toast.error(
//             `Error creating fee for ${child.fullName}: ${error.response.data.message}`
//           );
//         });
//     });

//     setIsOpen(false);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search by name"
//         value={searchTerm}
//         onChange={handleSearch}
//         className="p-2 border border-gray-300 rounded mb-4"
//       />
//       {filteredStudents.length > 0 && (
//         <div className="max-h-60 overflow-y-auto border border-gray-300 rounded">
//           {filteredStudents.map((student, index) => (
//             <div
//               key={index}
//               className="p-2 border-b cursor-pointer hover:bg-gray-100"
//               onClick={() => handleStudentClick(student.parentAdmissionNumber)}
//             >
//               {student.fullName || "No Name"}, {student.class},{" "}
//               {student.fatherName}, {student.admissionNumber}

//             </div>
//           ))}
//         </div>
//       )}
//       {isOpen && (
//         <div
//           id="default-modal"
//           tabIndex="-1"
//           aria-hidden="true"
//           className="fixed top-0 right-0 left-0 z-[99999999] flex justify-center items-center w-full h-screen bg-gray-900 bg-opacity-50"
//         >
//           <div className="relative p-4 w-full max-h-full" data-aos="fade-down">
//             <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
//               <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                   Fees Form
//                 </h3>
//                 <button
//                   onClick={toggleModal}
//                   type="button"
//                   className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
//                 >
//                   <svg
//                     aria-hidden="true"
//                     className="w-3 h-3"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M6 18L18 6M6 6l12 12"
//                     ></path>
//                   </svg>
//                   <span className="sr-only">Close modal</span>
//                 </button>
//               </div>
//               <form onSubmit={handleSubmit}>
//                 <div className="flex-col justify-start p-5">
//                   {parentData.map((child, index) => (
//                     <div
//                       key={index}
//                       className={`p-4 mb-4 border ${
//                         selectedChildren.includes(index)
//                           ? "border-blue-500"
//                           : "border-gray-300"
//                       } rounded-lg`}
//                     >
//                       <h4 className="text-lg font-semibold mb-2">
//                         {child.fullName} ({child.class})
//                       </h4>

//                       <label className="flex items-center mb-4">
//                         <input
//                           type="checkbox"
//                           checked={selectedChildren.includes(index)}
//                           onChange={() => handleChildSelection(index)}
//                           className="form-checkbox"
//                         />
//                         <span className="ml-2">Select Child</span>
//                       </label>

//                       {selectedChildren.includes(index) && (
//                         <>
//                           <div>
// <p>
//   <strong>Total Fee Amount:</strong> {formData[index]?.totalAmount}
//   </p>
//   <p>
//   <strong>Stored Fee Values:</strong>

//     {feeValues.map((value, idx) => (
//       <span key={idx}>{value}</span>
//     ))}

// </p>
// <span className="text-red-500">
//         Dues RS. {dues}
//       </span>
//     </div>
// <div className="">
//                             <label className="block">Months</label>
//                             <Select
//                               options={[
//                                 "January",
//                                 "February",
//                                 "March",
//                                 "April",
//                                 "May",
//                                 "June",
//                                 "July",
//                                 "August",
//                                 "September",
//                                 "October",
//                                 "November",
//                                 "December",
//                               ].map((month) => ({
//                                 value: month,
//                                 label: month,
//                               }))}
//                               value={formData[index]?.selectedMonths?.map(
//                                 (month) => ({
//                                   value: month,
//                                   label: month,
//                                 })
//                               )}
//                               onChange={(selectedOptions) =>
//                                 handleInputChange(
//                                   index,
//                                   "selectedMonths",
//                                   selectedOptions.map((option) => option.value)
//                                 )
//                               }
//                               isMulti
//                               name="months"
//                               className="basic-multi-select"
//                               classNamePrefix="select"
//                             />
//                           </div>
//                           <label className="block mb-2">
//                             Fee Date:
//                             <input
//                               type="date"
//                               value={formData[index]?.feeDate || ""}
//                               onChange={(e) =>
//                                 handleInputChange(
//                                   index,
//                                   "feeDate",
//                                   e.target.value
//                                 )
//                               }
//                               className="block w-full mt-1 p-2 border border-gray-300 rounded"
//                             />
//                           </label>

//                           <label className="block mb-2">
//                             Fee Status:
//                             <select
//                               value={formData[index]?.feeStatus || "Paid"}
//                               onChange={(e) =>
//                                 handleInputChange(
//                                   index,
//                                   "feeStatus",
//                                   e.target.value
//                                 )
//                               }
//                               className="block w-full mt-1 p-2 border border-gray-300 rounded"
//                             >
//                               <option value="Paid">Paid</option>
//                               <option value="Unpaid">Unpaid</option>
//                             </select>
//                           </label>

//                           <label className="block mb-2">
//                             Payment Mode:
//                             <select
//                               value={formData[index]?.paymentMode || "Online"}
//                               onChange={(e) =>
//                                 handleInputChange(
//                                   index,
//                                   "paymentMode",
//                                   e.target.value
//                                 )
//                               }
//                               className="block w-full mt-1 p-2 border border-gray-300 rounded"
//                             >
//                               <option value="Online">Online</option>
//                               <option value="Offline">Offline</option>
//                             </select>
//                           </label>

//                           <label className="block mb-2">
//                             Select Additional Fees:
//                             <Select
//                               isMulti
//                               value={formData[index]?.selectedAdditionalFees || []}
//                               options={allFees}
//                               onChange={(selectedOptions) =>
//                                 handleAdditionalFeesChange(index, selectedOptions)
//                               }
//                               className="mt-1"
//                             />
//                           </label>

//                           {formData[index]?.additionalFeeValues?.map(
//                             (feeData, feeIndex) => (
//                               <div key={feeIndex} className="mb-2">
//                                 <label className="block">
//                                   {feeData.fee}:
//                                   <input
//                                     type="number"
//                                     value={feeData.value || ""}
//                                     onChange={(e) =>
//                                       handleFeeValueChange(
//                                         index,
//                                         feeData.fee,
//                                         e.target.value
//                                       )
//                                     }
//                                     className="block w-full mt-1 p-2 border border-gray-300 rounded"
//                                   />
//                                 </label>
//                               </div>
//                             )
//                           )}
//                         </>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <div className="flex justify-end p-4 border-t dark:border-gray-600 w-full">
//                   <button
//                     type="submit"
//                     className="px-4 py-2  bg-blue-600 text-white rounded w-full"
//                   >
//                     Submit Fees
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NewCheckFee;



import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Select from "react-select";
import { toast } from "react-toastify";

const NewCheckFee = () => {
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [feeAmount, setFeeAmount] = useState();
  const [allStudent, setAllStudent] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [allFees, setAllFees] = useState([]);
  const [selectedAdditionalFees, setSelectedAdditionalFees] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [parentData, setParentData] = useState([]);
  const [formData, setFormData] = useState([]);
  const authToken = Cookies.get("token");

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const getCurrentMonth = () => {
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" });
    return month;
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    axios
      .get(
        "https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setAllStudent(response.data.allStudent);
      });
  }, [authToken]);

  useEffect(() => {
    axios
      .get("https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllFees", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        const feesData = response.data.map((fee) => {
          const label =
            fee.name && fee.amount
              ? `${fee.name} (${fee.amount})`
              : "Unknown Fee";
          const value = fee.amount ? fee.amount.toString() : "0";

          return {
            label,
            value,
          };
        });

        setAllFees(feesData);
        setSelectedAdditionalFees(feesData);
      });
  }, [authToken]);

  const handleChildSelection = (childIndex) => {
    setSelectedChildren((prevSelected) =>
      prevSelected.includes(childIndex)
        ? prevSelected.filter((index) => index !== childIndex)
        : [...prevSelected, childIndex]
    );
  };

  const getTotalFeesAmount = (childFormData) => {
    const regularFeesAmount =
      childFormData.getFee * childFormData.selectedMonths.length;
    const additionalFeesAmount = Array.isArray(
      childFormData.selectedAdditionalFees
    )
      ? childFormData.selectedAdditionalFees.reduce(
          (total, fee) => total + parseFloat(fee.value),
          0
        )
      : 0;

    return regularFeesAmount + additionalFeesAmount;
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase().trim();
    setSearchTerm(searchValue);
    if (searchValue === "") {
      setFilteredStudents([]);
    } else {
      const filtered = allStudent.filter(
        (student) =>
          student.fullName &&
          student.fullName.toLowerCase().includes(searchValue)
      );
      setFilteredStudents(filtered);
    }
  };

  const handleStudentClick = (admissionNumber) => {
    axios
      .get(
        `https://eshikshaserver.onrender.com/api/v1/adminRoute/getParentWithChildren/${admissionNumber}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        const children = response.data.children;
        setParentData(children);
        const initialFormData = children.map((child) => ({
          admissionNumber: child.admissionNumber,
          feeAmount: "",
          selectedMonths: [getCurrentMonth()],
          feeDate: getCurrentDate(),
          feeStatus: "Paid",
          paymentMode: "Online",
          selectedAdditionalFees: [],
          amountSubmitted: 0,
          getFee: 0,
        }));

        setFormData(initialFormData);
        setIsOpen(true);
      });
  };

  const handleInputChange = (index, field, value) => {
    const updatedFormData = [...formData];
    updatedFormData[index][field] = value;
    setFormData(updatedFormData);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setParentData([]);
    setFormData([]);
  };

  const handleAdditionalFeesChange = (index, selectedOptions) => {
    const updatedFormData = [...formData];
    updatedFormData[index].selectedAdditionalFees = selectedOptions;

    const updatedFeeValues = selectedOptions.map((option) => ({
      fee: option.label,
      value: 0,
    }));

    updatedFormData[index].additionalFeeValues = updatedFeeValues;
    setFormData(updatedFormData);
  };

  const handleFeeValueChange = (index, fee, value) => {
    const updatedFormData = [...formData];
    const feeValues = updatedFormData[index].additionalFeeValues.map((item) =>
      item.fee === fee ? { ...item, value: parseFloat(value) || 0 } : item
    );
    updatedFormData[index].additionalFeeValues = feeValues;
    setFormData(updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    selectedChildren.forEach((childIndex) => {
      const child = parentData[childIndex];
      const childFormData = formData[childIndex];
      if (childFormData.selectedMonths.length === 0) {
        alert(
          `Please select at least one month for regular fees for ${child.fullName}.`
        );
        return;
      }

      const totalAmount = getTotalFeesAmount(childFormData);
      setFeeAmount(totalAmount);
      const feeStatus =
        childFormData.amountSubmitted === totalAmount ? "Paid" : "Unpaid";
      const feeHistoryData = childFormData.selectedMonths.map((month) => ({
        paidAmount: childFormData.additionalFeeValues.map((feeData) => ({
          name: feeData.fee,
          amount: feeData.value,
        })),
        month: month,
        status: feeStatus,
        date: childFormData.feeDate,
        paymentMode: childFormData.paymentMode,
      }));

      const newFeeData = {
        admissionNumber: child.admissionNumber,
        className: child.class,
        feeHistory: feeHistoryData,
        dues:
          totalAmount -
          childFormData.additionalFeeValues.map((feeData) => feeData.value),
      };
      axios
        .post(
          "https://eshikshaserver.onrender.com/api/v1/fees/createFeeStatus",
          newFeeData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((response) => {
          toast.success(
            `Fee created for ${child.fullName}: ${response.data.message}`
          );
        })
        .catch((error) => {
          console.error("Error Posting Data: ", error);
          toast.error(
            `Error creating fee for ${child.fullName}: ${error.response.data.message}`
          );
        });
    });

    setIsOpen(false);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
        className="p-2 border border-gray-300 rounded mb-4"
      />
      {filteredStudents.length > 0 && (
        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded">
          {filteredStudents.map((student, index) => (
            <div
              key={index}
              className="p-2 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => handleStudentClick(student.parentAdmissionNumber)}
            >
              {student.fullName || "No Name"}, {student.class},{" "}
              {student.fatherName}, {student.admissionNumber}
            </div>
          ))}
        </div>
      )}
      {isOpen && (
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-[99999999] flex justify-center items-center w-full h-screen bg-gray-900 bg-opacity-50"
        >
          <div className="relative p-4 w-full max-h-full" data-aos="fade-down">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Fees Form
                </h3>
                <button
                  onClick={toggleModal}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="default-modal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1l12 12M13 1L1 13"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className=" w-full ">
                <div className="flex-grow max-h-[80vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh]  overflow-auto ">
                  {parentData.length > 0 && formData.length > 0 ? (
                    <form
                      onSubmit={handleSubmit}
                      className=" flex md:flex-row flex-col w-full "
                    >
                      {parentData.map((child, index) => (
                        <div
                          key={index}
                          className="bg-gray-200  m-3 w-full p-3"
                        >
                          <input
                            type="checkbox"
                            checked={selectedChildren.includes(index)}
                            onChange={() => handleChildSelection(index)}
                          />
                          <p>
                            <strong>Student:</strong> {child.fullName}
                          </p>
                          <p>
                            <strong>Class:</strong> {child.class}
                          </p>

                          <p>
                            <strong>total Fee amount:</strong> {feeAmount}
                          </p>

                          <div className="mb-4">
                            <label
                              htmlFor={`additionalFees-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              AdditionalFees Fees
                            </label>
                            <Select
                              isMulti
                              options={allFees}
                              onChange={(selectedOptions) =>
                                handleAdditionalFeesChange(
                                  index,
                                  selectedOptions
                                )
                              }
                              className="basic-single"
                              classNamePrefix="select"
                            />
                            {formData[index]?.additionalFeeValues?.map(
                              (feeData, feeIndex) => (
                                <div key={feeIndex} className="mt-2">
                                  <label className="block">{`Fee: ${feeData.fee}`}</label>

                                  <input
                                    type="number"
                                    value={feeData.value || 0}
                                    onChange={(e) =>
                                      handleFeeValueChange(
                                        index,
                                        feeData.fee,
                                        e.target.value
                                      )
                                    }
                                    className="p-2 border border-gray-300 rounded w-full"
                                  />
                                </div>
                              )
                            )}
                          </div>
                          <div className="">
                            <label className="block ">Fee Status</label>
                            <select
                              className="w-full border p-2  dark:bg-secondary-dark-bg  dark:text-white"
                              value={formData.feeStatus || "Unpaid"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  feeStatus: e.target.value,
                                })
                              }
                            >
                              <option
                                value="Paid"
                                className=" dark:bg-secondary-dark-bg  dark:text-white"
                              >
                                Paid
                              </option>
                              <option
                                value="Unpaid"
                                className=" dark:bg-secondary-dark-bg  dark:text-white"
                              >
                                Unpaid
                              </option>
                            </select>
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor={`feeDate-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Fee Date
                            </label>
                            <input
                              id={`feeDate-${index}`}
                              type="date"
                              value={
                                formData[index]?.feeDate || getCurrentDate()
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "feeDate",
                                  e.target.value
                                )
                              }
                              className="p-2 border border-gray-300 rounded w-full"
                            />
                          </div>
                          <div className="">
                            <label className="block">Payment Mode</label>
                            <select
                              value={formData[index]?.paymentMode || "Online"}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "paymentMode",
                                  e.target.value
                                )
                              }
                              className="p-2 border border-gray-300 rounded w-full"
                            >
                              <option value="Online">Online</option>
                              <option value="Cash">Cash</option>
                              <option value="Cheque">Cheque</option>
                            </select>
                          </div>

  <div className="">
    <label className="block">Months</label>
    <Select
      options={[
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ].map((month) => ({
        value: month,
        label: month,
      }))}
      value={formData[index]?.selectedMonths?.map(
        (month) => ({
          value: month,
          label: month,
        })
      )}
      onChange={(selectedOptions) =>
        handleInputChange(
          index,
          "selectedMonths",
          selectedOptions.map((option) => option.value)
        )
      }
      isMulti
      name="months"
      className="basic-multi-select"
      classNamePrefix="select"
    />
  </div>
                        </div>
                      ))}
                    </form>
                  ) : (
                    <p>No parent or children data available.</p>
                  )}
                  <div className="w-full gap-5 grid grid-cols-1 md:grid-cols-2 p-4">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="bg-blue-500 w-full text-white px-4 py-2 rounded self-end"
                    >
                      Submit
                    </button>
                    <button
                      type="submit"
                      onClick={toggleModal}
                      className="bg-gray-500 w-full text-white px-4 py-2 rounded self-end"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewCheckFee;

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import Select from "react-select";
// import { toast } from "react-toastify";

// const NewCheckFee = () => {
//   const [selectedChildren, setSelectedChildren] = useState([]);
//   const [feeAmount, setFeeAmount] = useState();
//   const [allStudent, setAllStudent] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [allFees, setAllFees] = useState([]);
//   const [selectedAdditionalFees, setSelectedAdditionalFees] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [parentData, setParentData] = useState([]);
//   const [formData, setFormData] = useState([]);
//   const authToken = Cookies.get("token");

//   const toggleModal = () => {
//     setIsOpen(!isOpen);
//   };

//   const getCurrentMonth = () => {
//     const today = new Date();
//     const month = today.toLocaleString("default", { month: "long" });
//     return month;
//   };

//   const getCurrentDate = () => {
//     const today = new Date();
//     return today.toISOString().split("T")[0];
//   };

//   useEffect(() => {
//     axios
//       .get(
//         "https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents",
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         setAllStudent(response.data.allStudent);
//       });
//   }, [authToken]);

//   useEffect(() => {
//     axios
//       .get("https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllFees", {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       })
//       .then((response) => {
//         const feesData = response.data.map((fee) => {
//           const label =
//             fee.name && fee.amount
//               ? `${fee.name} (${fee.amount})`
//               : "Unknown Fee";
//           const value = fee.amount ? fee.amount.toString() : "0";

//           return {
//             label,
//             value,
//           };
//         });

//         setAllFees(feesData);
//         setSelectedAdditionalFees(feesData);
//       });
//   }, [authToken]);

//   const handleChildSelection = (childIndex) => {
//     setSelectedChildren((prevSelected) =>
//       prevSelected.includes(childIndex)
//         ? prevSelected.filter((index) => index !== childIndex)
//         : [...prevSelected, childIndex]
//     );
//   };

//   const getTotalFeesAmount = (childFormData) => {
//     const regularFeesAmount =
//       childFormData.getFee * childFormData.selectedMonths.length;
//     const additionalFeesAmount = Array.isArray(
//       childFormData.selectedAdditionalFees
//     )
//       ? childFormData.selectedAdditionalFees.reduce(
//           (total, fee) => total + parseFloat(fee.value),
//           0
//         )
//       : 0;

//     return regularFeesAmount + additionalFeesAmount;
//   };

//   const handleSearch = (event) => {
//     const searchValue = event.target.value.toLowerCase().trim();
//     setSearchTerm(searchValue);
//     if (searchValue === "") {
//       setFilteredStudents([]);
//     } else {
//       const filtered = allStudent.filter(
//         (student) =>
//           student.fullName &&
//           student.fullName.toLowerCase().includes(searchValue)
//       );
//       setFilteredStudents(filtered);
//     }
//   };

//   const handleStudentClick = (admissionNumber) => {
//     axios
//       .get(
//         `https://eshikshaserver.onrender.com/api/v1/adminRoute/getParentWithChildren/${admissionNumber}`,
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         const children = response.data.children;
//         setParentData(children);
//         const initialFormData = children.map((child) => ({
//           admissionNumber: child.admissionNumber,
//           feeAmount: "",
//           selectedMonths: [getCurrentMonth()],
//           feeDate: getCurrentDate(),
//           feeStatus: "Paid",
//           paymentMode: "Online",
//           selectedAdditionalFees: [],
//           amountSubmitted: 0,
//           getFee: 0,
//         }));

//         setFormData(initialFormData);
//         setIsOpen(true);
//       });
//   };

//   const handleInputChange = (index, field, value) => {
//     const updatedFormData = [...formData];
//     updatedFormData[index][field] = value;
//     setFormData(updatedFormData);
//   };

//   const handleCloseModal = () => {
//     setIsOpen(false);
//     setParentData([]);
//     setFormData([]);
//   };

//   const handleAdditionalFeesChange = (index, selectedOptions) => {
//     const updatedFormData = [...formData];
//     updatedFormData[index].selectedAdditionalFees = selectedOptions;

//     const updatedFeeValues = selectedOptions.map((option) => ({
//       fee: option.label,
//       value: 0,
//     }));

//     updatedFormData[index].additionalFeeValues = updatedFeeValues;
//     setFormData(updatedFormData);
//   };

//   const handleFeeValueChange = (index, fee, value) => {
//     const updatedFormData = [...formData];
//     const feeValues = updatedFormData[index].additionalFeeValues.map((item) =>
//       item.fee === fee ? { ...item, value: parseFloat(value) || 0 } : item
//     );
//     updatedFormData[index].additionalFeeValues = feeValues;
//     setFormData(updatedFormData);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     selectedChildren.forEach((childIndex) => {
//       const child = parentData[childIndex];
//       const childFormData = formData[childIndex];
//       if (childFormData.selectedMonths.length === 0) {
//         alert(
//           `Please select at least one month for regular fees for ${child.fullName}.`
//         );
//         return;
//       }

//       const totalAmount = getTotalFeesAmount(childFormData);
//       setFeeAmount(totalAmount);
//       const feeStatus =
//         childFormData.amountSubmitted === totalAmount ? "Paid" : "Unpaid";
//       const feeHistoryData = childFormData.selectedMonths.map((month) => ({
//         paidAmount: childFormData.additionalFeeValues.map((feeData) => ({
//           name: feeData.fee,
//           amount: feeData.value,
//         })),
//         month: month,
//         status: feeStatus,
//         date: childFormData.feeDate,
//         paymentMode: childFormData.paymentMode,
//       }));

//       const newFeeData = {
//         admissionNumber: child.admissionNumber,
//         className: child.class,
//         feeHistory: feeHistoryData,
//         dues:
//           totalAmount -
//           childFormData.additionalFeeValues.map((feeData) => feeData.value),
//       };
//       console.log("newFeeData", newFeeData);
//       axios
//         .post(
//           "https://eshikshaserver.onrender.com/api/v1/fees/createFeeStatus",
//           newFeeData,
//           {
//             withCredentials: true,
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//             },
//           }
//         )
//         .then((response) => {
//           toast.success(
//             `Fee created for ${child.fullName}: ${response.data.message}`
//           );
//         })
//         .catch((error) => {
//           console.error("Error Posting Data: ", error);
//           toast.error(
//             `Error creating fee for ${child.fullName}: ${error.response.data.message}`
//           );
//         });
//     });

//     setIsOpen(false);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search by name"
//         value={searchTerm}
//         onChange={handleSearch}
//         className="p-2 border border-gray-300 rounded mb-4"
//       />
//       {filteredStudents.length > 0 && (
//         <div className="max-h-60 overflow-y-auto border border-gray-300 rounded">
//           {filteredStudents.map((student, index) => (
//             <div
//               key={index}
//               className="p-2 border-b cursor-pointer hover:bg-gray-100"
//               onClick={() => handleStudentClick(student.parentAdmissionNumber)}
//             >
//               {student.fullName || "No Name"}, {student.class},{" "}
//               {student.fatherName}, {student.admissionNumber}
//             </div>
//           ))}
//         </div>
//       )}
//       {isOpen && (
//         <div
//           id="default-modal"
//           tabIndex="-1"
//           aria-hidden="true"
//           className="fixed top-0 right-0 left-0 z-[99999999] flex justify-center items-center w-full h-screen bg-gray-900 bg-opacity-50"
//         >
//           <div className="relative p-4 w-full max-h-full" data-aos="fade-down">
//             <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
//               <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                   Fees Form
//                 </h3>
//                 <button
//                   onClick={toggleModal}
//                   type="button"
//                   className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
//                   data-modal-toggle="default-modal"
//                 >
//                   <svg
//                     className="w-3 h-3"
//                     aria-hidden="true"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 14 14"
//                   >
//                     <path
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M1 1l12 12M13 1L1 13"
//                     />
//                   </svg>
//                   <span className="sr-only">Close modal</span>
//                 </button>
//               </div>
//               <div className=" w-full ">
//                 <div className="flex-grow max-h-[80vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh]  overflow-auto ">
//                   {parentData.length > 0 && formData.length > 0 ? (
//                     <form
//                       onSubmit={handleSubmit}
//                       className=" flex md:flex-row flex-col w-full "
//                     >
//                       {parentData.map((child, index) => (
//                         <div
//                           key={index}
//                           className="bg-gray-200  m-3 w-full p-3"
//                         >
//                           <input
//                             type="checkbox"
//                             checked={selectedChildren.includes(index)}
//                             onChange={() => handleChildSelection(index)}
//                           />
//                           <p>
//                             <strong>Student:</strong> {child.fullName}
//                           </p>
//                           <p>
//                             <strong>Class:</strong> {child.class}
//                           </p>

//                           <p>
//                             <strong>total Fee amount:</strong> {feeAmount}
//                           </p>

//                           <div className="mb-4">
//                             <label
//                               htmlFor={`additionalFees-${index}`}
//                               className="block text-sm font-medium text-gray-700"
//                             >
//                               AdditionalFees Fees
//                             </label>
//                             <Select
//                               isMulti
//                               options={allFees}
//                               onChange={(selectedOptions) =>
//                                 handleAdditionalFeesChange(
//                                   index,
//                                   selectedOptions
//                                 )
//                               }
//                               className="basic-single"
//                               classNamePrefix="select"
//                             />
//                             {formData[index]?.additionalFeeValues?.map(
//                               (feeData, feeIndex) => (
//                                 <div key={feeIndex} className="mt-2">
//                                   <label className="block">{`Fee: ${feeData.fee}`}</label>
//                                   <input
//                                     type="number"
//                                     value={feeData.value || 0}
//                                     onChange={(e) =>
//                                       handleFeeValueChange(
//                                         index,
//                                         feeData.fee,
//                                         e.target.value
//                                       )
//                                     }
//                                     className="p-2 border border-gray-300 rounded w-full"
//                                   />
//                                 </div>
//                               )
//                             )}
//                           </div>
//                           <div className="">
//                             <label className="block ">Fee Status</label>
//                             <select
//                               className="w-full border p-2  dark:bg-secondary-dark-bg  dark:text-white"
//                               value={formData.feeStatus || "Unpaid"}
//                               onChange={(e) =>
//                                 setFormData({
//                                   ...formData,
//                                   feeStatus: e.target.value,
//                                 })
//                               }
//                             >
//                               <option
//                                 value="Paid"
//                                 className=" dark:bg-secondary-dark-bg  dark:text-white"
//                               >
//                                 Paid
//                               </option>
//                               <option
//                                 value="Unpaid"
//                                 className=" dark:bg-secondary-dark-bg  dark:text-white"
//                               >
//                                 Unpaid
//                               </option>
//                             </select>
//                           </div>
//                           <div className="mb-4">
//                             <label
//                               htmlFor={`feeDate-${index}`}
//                               className="block text-sm font-medium text-gray-700"
//                             >
//                               Fee Date
//                             </label>
//                             <input
//                               id={`feeDate-${index}`}
//                               type="date"
//                               value={
//                                 formData[index]?.feeDate || getCurrentDate()
//                               }
//                               onChange={(e) =>
//                                 handleInputChange(
//                                   index,
//                                   "feeDate",
//                                   e.target.value
//                                 )
//                               }
//                               className="p-2 border border-gray-300 rounded w-full"
//                             />
//                           </div>
//                           <div className="">
//                             <label className="block">Payment Mode</label>
//                             <select
//                               value={formData[index]?.paymentMode || "Online"}
//                               onChange={(e) =>
//                                 handleInputChange(
//                                   index,
//                                   "paymentMode",
//                                   e.target.value
//                                 )
//                               }
//                               className="p-2 border border-gray-300 rounded w-full"
//                             >
//                               <option value="Online">Online</option>
//                               <option value="Cash">Cash</option>
//                               <option value="Cheque">Cheque</option>
//                             </select>
//                           </div>

//                           <div className="">
//                             <label className="block">Months</label>
//                             <Select
//                               options={[
//                                 "January",
//                                 "February",
//                                 "March",
//                                 "April",
//                                 "May",
//                                 "June",
//                                 "July",
//                                 "August",
//                                 "September",
//                                 "October",
//                                 "November",
//                                 "December",
//                               ].map((month) => ({
//                                 value: month,
//                                 label: month,
//                               }))}
//                               value={formData[index]?.selectedMonths?.map(
//                                 (month) => ({
//                                   value: month,
//                                   label: month,
//                                 })
//                               )}
//                               onChange={(selectedOptions) =>
//                                 handleInputChange(
//                                   index,
//                                   "selectedMonths",
//                                   selectedOptions.map((option) => option.value)
//                                 )
//                               }
//                               isMulti
//                               name="months"
//                               className="basic-multi-select"
//                               classNamePrefix="select"
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </form>
//                   ) : (
//                     <p>No parent or children data available.</p>
//                   )}
//                   <div className="w-full gap-5 grid grid-cols-1 md:grid-cols-2 p-4">
//                     <button
//                       type="submit"
//                       onClick={handleSubmit}
//                       className="bg-blue-500 w-full text-white px-4 py-2 rounded self-end"
//                     >
//                       Submit
//                     </button>
//                     <button
//                       type="submit"
//                       onClick={toggleModal}
//                       className="bg-gray-500 w-full text-white px-4 py-2 rounded self-end"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NewCheckFee;

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import Select from "react-select";
// import { toast } from "react-toastify";

// const NewCheckFee = () => {
//   const [selectedChildren, setSelectedChildren] = useState([]);
//   const [allStudent, setAllStudent] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [allFees, setAllFees] = useState([]);
//   const [selectedAdditionalFees, setSelectedAdditionalFees] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [parentData, setParentData] = useState([]);
//   const [formData, setFormData] = useState([]);
//   const authToken = Cookies.get("token");
//   const toggleModal = () => {
//     setIsOpen(!isOpen);
//   };

// const getCurrentMonth = () => {
//     const today = new Date();
//     const month = today.toLocaleString("default", { month: "long" });
//     return month;
//   };

//   const getCurrentDate = () => {
//     const today = new Date();
//     return today.toISOString().split("T")[0];
//   };

//   useEffect(() => {
//     axios
//       .get(
//         "https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents",
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         setAllStudent(response.data.allStudent);
//       });
//   }, [authToken]);

//   useEffect(() => {
//     axios
//       .get("https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllFees", {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       })
//       .then((response) => {
//         const feesData = response.data.map((fee) => {
//           const label =
//             fee.name && fee.amount
//               ? `${fee.name} (${fee.amount})`
//               : "Unknown Fee";
//           const value = fee.amount ? fee.amount.toString() : "0";

//           return {
//             label,
//             value,
//           };
//         });

//         setAllFees(feesData);
//         setSelectedAdditionalFees(feesData);
//       });
//   }, [authToken]);
//   const handleChildSelection = (childIndex) => {
//     // Toggle the selection of a child
//     setSelectedChildren((prevSelected) =>
//       prevSelected.includes(childIndex)
//         ? prevSelected.filter((index) => index !== childIndex)
//         : [...prevSelected, childIndex]
//     );
//   };

//   const getTotalFeesAmount = (childFormData) => {
//     const regularFeesAmount =
//       childFormData.getFee * childFormData.selectedMonths.length;
//     const additionalFeesAmount = Array.isArray(
//       childFormData.selectedAdditionalFees
//     )
//       ? childFormData.selectedAdditionalFees.reduce(
//           (total, fee) => total + parseFloat(fee.value),
//           0
//         )
//       : 0;

//     return regularFeesAmount + additionalFeesAmount;
//   };

//   const handleSearch = (event) => {
//     const searchValue = event.target.value.toLowerCase().trim();
//     setSearchTerm(searchValue);

//     if (searchValue === "") {
//       setFilteredStudents([]);
//     } else {
//       const filtered = allStudent.filter(
//         (student) =>
//           student.fullName &&
//           student.fullName.toLowerCase().includes(searchValue)
//       );
//       setFilteredStudents(filtered);
//     }
//   };

//   const handleStudentClick = (admissionNumber) => {
//     axios
//       .get(
//         `https://eshikshaserver.onrender.com/api/v1/adminRoute/getParentWithChildren/${admissionNumber}`,
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         const children = response.data.children;
//         setParentData(children);

//         // Initialize formData for each child
//         const initialFormData = children.map((child) => ({
//           admissionNumer: child.admissionNumber,
//           feeAmount: "",
//           selectedMonths: [getCurrentMonth()],
//           feeDate: getCurrentDate(),
//           feeStatus: "Paid",
//           paymentMode: "Online",
//           selectedAdditionalFees: [],
//           amountSubmitted: 0,
//           getFee: 0, // initialize with 0 or fetched value
//         }));

//         setFormData(initialFormData);
//         setIsOpen(true);

//       });
//   };

//   const handleInputChange = (index, field, value) => {
//     const updatedFormData = [...formData];
//     updatedFormData[index][field] = value;
//     setFormData(updatedFormData);
//   };

//   const handleCloseModal = () => {
//     setIsOpen(false);

//     setParentData([]);
//     setFormData([]);
//   };

//   const handleAdditionalFeesChange = (index, selectedOptions) => {
//     const updatedFormData = [...formData];
//     updatedFormData[index].selectedAdditionalFees = selectedOptions;
//     setFormData(updatedFormData);

//     // Ensure there are enough input fields for all selected additional fees
//     const additionalFees = selectedOptions.map((option) => option.value);
//     const currentFees = updatedFormData[index].additionalFeeValues || [];

//     // Update formData to add missing fields
//     const updatedFeeValues = additionalFees.map((fee) => {
//       const existing = currentFees.find((item) => item.fee === fee);
//       return existing || { fee, value: 0 };
//     });

//     updatedFormData[index].additionalFeeValues = updatedFeeValues;
//     setFormData(updatedFormData);
//   };

//   const handleFeeValueChange = (index, fee, value) => {
//     const updatedFormData = [...formData];
//     const feeValues = updatedFormData[index].additionalFeeValues.map((item) =>
//       item.fee === fee ? { ...item, value: parseFloat(value) || 0 } : item
//     );
//     updatedFormData[index].additionalFeeValues = feeValues;
//     setFormData(updatedFormData);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     selectedChildren.forEach((childIndex) => {
//       const child = parentData[childIndex];
//       const childFormData = formData[childIndex];

//       if (childFormData.selectedMonths.length === 0) {
//         alert(`Please select at least one month for regular fees for ${child.fullName}.`);
//         return;
//       }

//       const totalAmount = getTotalFeesAmount(childFormData);
//       const feeStatus = childFormData.amountSubmitted === totalAmount ? "Paid" : "Unpaid";

//       const feeHistoryData = childFormData.selectedMonths.map((month) => ({
//         paidAmount: childFormData.amountSubmitted,
//         month: month,
//         status: feeStatus,
//         date: childFormData.feeDate,
//         paymentMode: childFormData.paymentMode,
//       }));

//       const newFeeData = {
//         admissionNumber: child.admissionNumber,
//         className: child.class,
//         feeHistory: feeHistoryData,
//         dues: totalAmount - childFormData.amountSubmitted,
//         additionalFees: childFormData.additionalFeeValues, // include additional fees
//       };

//       axios.post(
//         "https://eshikshaserver.onrender.com/api/v1/fees/createFeeStatus",
//         newFeeData,
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         toast.success(`Fee created for ${child.fullName}: ${response.data.message}`);
//       })
//       .catch((error) => {
//         console.error("Error Posting Data: ", error);
//         toast.error(`Error creating fee for ${child.fullName}: ${error.response.data.message}`);
//       });
//     });

//     setIsOpen(false);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search by name"
//         value={searchTerm}
//         onChange={handleSearch}
//         className="p-2 border border-gray-300 rounded mb-4"
//       />
//       {filteredStudents.length > 0 && (
//         <div className="max-h-60 overflow-y-auto border border-gray-300 rounded">
//           {filteredStudents.map((student, index) => (
//             <div
//               key={index}
//               className="p-2 border-b cursor-pointer hover:bg-gray-100"
//               onClick={() => handleStudentClick(student.parentAdmissionNumber)}
//             >
//               {student.fullName || "No Name"}, {student.class},{" "}
//               {student.fatherName}, {student.admissionNumber}
//             </div>
//           ))}
//         </div>
//       )}
//       {isOpen && (
//         <div
//           id="default-modal"
//           tabIndex="-1"
//           aria-hidden="true"
//           className="fixed top-0 right-0 left-0 z-[99999999] flex justify-center items-center w-full h-screen bg-gray-900 bg-opacity-50"
//         >
//           <div className="relative p-4 w-full max-h-full" data-aos="fade-down">
//             <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
//               <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                   Fees Form
//                 </h3>
//                 <button
//                   onClick={toggleModal}
//                   type="button"
//                   className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
//                 >
//                   <svg
//                     className="w-3 h-3"
//                     aria-hidden="true"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 14 14"
//                   >
//                     <path
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
//                     />
//                   </svg>
//                   <span className="sr-only">Close modal</span>
//                 </button>
//               </div>

//   <div className=" w-full ">
//     <div className="flex-grow max-h-[80vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh]  overflow-auto ">
//       {parentData.length > 0 && formData.length > 0 ? (
//         <form
//           onSubmit={handleSubmit}
//           className=" flex md:flex-row flex-col w-full "
//         >
//                       {parentData.map((child, index) => (
//                         <div
//                           key={index}
//                           className="bg-gray-200  m-3 w-full p-3"
//                         >
//   <input
//     type="checkbox"
//     checked={selectedChildren.includes(index)}
//     onChange={() => handleChildSelection(index)}
//   />
//   <p>
//     <strong>Student:</strong> {child.fullName}
//   </p>
//   <p>
//     <strong>Class:</strong> {child.class}
//   </p>

//                           <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
// <div className="">
//   <label className="block">Months</label>
//   <Select
//     options={[
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ].map((month) => ({
//       value: month,
//       label: month,
//     }))}
//     value={formData[index]?.selectedMonths?.map(
//       (month) => ({
//         value: month,
//         label: month,
//       })
//     )}
//     onChange={(selectedOptions) =>
//       handleInputChange(
//         index,
//         "selectedMonths",
//         selectedOptions.map(
//           (option) => option.value
//         )
//       )
//     }
//     isMulti
//     name="months"
//     className="basic-multi-select"
//     classNamePrefix="select"
//   />
// </div>
//                             <div className="">
//                               <label className="block">Fee Date</label>
//                               <input
//                                 type="date"
//                                 value={
//                                   formData[index]?.feeDate || getCurrentDate()
//                                 }
//                                 onChange={(e) =>
//                                   handleInputChange(
//                                     index,
//                                     "feeDate",
//                                     e.target.value
//                                   )
//                                 }
//                                 className="p-2 border border-gray-300 rounded w-full"
//                               />
//                             </div>
//                             <div className="">
//                               <label className="block">Payment Mode</label>
//                               <select
//                                 value={formData[index]?.paymentMode || "Online"}
//                                 onChange={(e) =>
//                                   handleInputChange(
//                                     index,
//                                     "paymentMode",
//                                     e.target.value
//                                   )
//                                 }
//                                 className="p-2 border border-gray-300 rounded w-full"
//                               >
//                                 <option value="Online">Online</option>
//                                 <option value="Cash">Cash</option>
//                                 <option value="Cheque">Cheque</option>
//                               </select>
//                             </div>
//                             <div className="">
//                               <label className="block">Select Additional Fees</label>
//                               <Select
//                                 options={allFees}
//                                 value={formData[index]?.selectedAdditionalFees || []}
//                                 onChange={(selectedOptions) =>
//                                   handleAdditionalFeesChange(index, selectedOptions)
//                                 }
//                                 isMulti
//                                 name="fees"
//                                 className="basic-multi-select"
//                                 classNamePrefix="select"
//                               />
//                             </div>

//                             {formData[index]?.additionalFeeValues?.map((feeData, feeIndex) => (
//                               <div key={feeIndex} className="">
//                                 {console.log("firstfeeData",feeData)}
//                                 <label className="block">{`Fee: ${feeData.fee}`}</label>
//                                 <input
//                                   type="number"
//                                   value={feeData.value || 0}
//                                   onChange={(e) =>
//                                     handleFeeValueChange(index, feeData.fee, e.target.value)
//                                   }
//                                   className="p-2 border border-gray-300 rounded w-full"
//                                 />
//                               </div>
//                             ))}

//                             <div className="">
//                               <label className="block">Amount Submitted</label>
//                               <input
//                                 type="number"
//                                 value={formData[index]?.amountSubmitted || 0}
//                                 onChange={(e) =>
//                                   handleInputChange(
//                                     index,
//                                     "amountSubmitted",
//                                     parseFloat(e.target.value) || 0
//                                   )
//                                 }
//                                 className="p-2 border border-gray-300 rounded w-full"
//                               />
//                             </div>
//                           </div>

//                           <hr className="my-4" />
//                         </div>
//                       ))}
//                     </form>
//                   ) : (
//                     <p>No parent or children data available.</p>
//                   )}
//                   <div className="w-full gap-5 grid grid-cols-1 md:grid-cols-2 p-4">
//                     <button
//                       type="submit"
//                       onClick={handleSubmit}
//                       className="bg-blue-500 w-full text-white px-4 py-2 rounded self-end"
//                     >
//                       Submit
//                     </button>
//                     <button
//                       type="submit"
//                       onClick={toggleModal}
//                       className="bg-gray-500 w-full text-white px-4 py-2 rounded self-end"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       ;
//     </div>
//   );
// };

// export default NewCheckFee;

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import Select from "react-select";
// import { toast } from "react-toastify";

// const NewCheckFee = () => {
//   const [selectedChildren, setSelectedChildren] = useState([]);
//   const [allStudent, setAllStudent] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [allFees, setAllFees] = useState([]);
//   const [selectedAdditionalFees, setSelectedAdditionalFees] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [parentData, setParentData] = useState([]);
//   const [formData, setFormData] = useState([]);
//   const authToken = Cookies.get("token");
//   const toggleModal = () => {
//     setIsOpen(!isOpen);
//   };
//   const getCurrentMonth = () => {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, "0");
//     return `${year}-${month}`;
//   };

//   const getCurrentDate = () => {
//     const today = new Date();
//     return today.toISOString().split("T")[0];
//   };

//   useEffect(() => {
//     axios
//       .get(
//         "https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents",
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         setAllStudent(response.data.allStudent);
//       });
//   }, [authToken]);

//   useEffect(() => {
//     axios
//       .get("https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllFees", {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       })
//       .then((response) => {
//         const feesData = response.data.map((fee) => {
//           const label =
//             fee.name && fee.amount
//               ? `${fee.name} (${fee.amount})`
//               : "Unknown Fee";
//           const value = fee.amount ? fee.amount.toString() : "0";

//           return {
//             label,
//             value,
//           };
//         });

//         setAllFees(feesData);
//         setSelectedAdditionalFees(feesData);
//       });
//   }, [authToken]);
//   const handleChildSelection = (childIndex) => {
//     // Toggle the selection of a child
//     setSelectedChildren((prevSelected) =>
//       prevSelected.includes(childIndex)
//         ? prevSelected.filter((index) => index !== childIndex)
//         : [...prevSelected, childIndex]
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     selectedChildren.forEach((childIndex) => {
//       const child = parentData[childIndex];
//       const childFormData = formData[childIndex];

//       if (childFormData.selectedMonths.length === 0) {
//         alert(
//           `Please select at least one month for regular fees for ${child.fullName}.`
//         );
//         return;
//       }

//       const totalAmount = getTotalFeesAmount(childFormData);
//       const feeStatus =
//         childFormData.amountSubmitted === totalAmount ? "Paid" : "Unpaid";

//       const feeHistoryData = childFormData.selectedMonths.map((month) => ({
//         paidAmount: childFormData.amountSubmitted,
//         month: month,
//         status: feeStatus,
//         date: childFormData.feeDate,
//         paymentMode: childFormData.paymentMode,
//       }));

//       const newFeeData = {
//         admissionNumber: child.admissionNumber,
//         className: child.class,
//         feeHistory: feeHistoryData,
//         dues: totalAmount - childFormData.amountSubmitted,
//       };

//       axios
//         .post(
//           "https://eshikshaserver.onrender.com/api/v1/fees/createFeeStatus",
//           newFeeData,
//           {
//             withCredentials: true,
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//             },
//           }
//         )
//         .then((response) => {
//           toast.success(
//             `Fee created for ${child.fullName}: ${response.data.message}`
//           );
//         })
//         .catch((error) => {
//           console.error("Error Posting Data: ", error);
//           toast.error(
//             `Error creating fee for ${child.fullName}: ${error.response.data.message}`
//           );
//         });
//     });

//     setIsOpen(false);
//   };

//   const getTotalFeesAmount = (childFormData) => {
//     const regularFeesAmount =
//       childFormData.getFee * childFormData.selectedMonths.length;
//     const additionalFeesAmount = Array.isArray(
//       childFormData.selectedAdditionalFees
//     )
//       ? childFormData.selectedAdditionalFees.reduce(
//           (total, fee) => total + parseFloat(fee.value),
//           0
//         )
//       : 0;

//     return regularFeesAmount + additionalFeesAmount;
//   };

//   const handleSearch = (event) => {
//     const searchValue = event.target.value.toLowerCase().trim();
//     setSearchTerm(searchValue);

//     if (searchValue === "") {
//       setFilteredStudents([]);
//     } else {
//       const filtered = allStudent.filter(
//         (student) =>
//           student.fullName &&
//           student.fullName.toLowerCase().includes(searchValue)
//       );
//       setFilteredStudents(filtered);
//     }
//   };

//   const handleStudentClick = (admissionNumber) => {
//     axios
//       .get(
//         `https://eshikshaserver.onrender.com/api/v1/adminRoute/getParentWithChildren/${admissionNumber}`,
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         const children = response.data.children;
//         setParentData(children);

//         // Initialize formData for each child
//         const initialFormData = children.map((child) => ({
//           admissionNumer: child.admissionNumber,
//           feeAmount: "",
//           selectedMonths: [getCurrentMonth()],
//           feeDate: getCurrentDate(),
//           feeStatus: "Paid",
//           paymentMode: "Online",
//           selectedAdditionalFees: [],
//           amountSubmitted: 0,
//           getFee: 0, // initialize with 0 or fetched value
//         }));

//         setFormData(initialFormData);
//         setIsOpen(true);

//       });
//   };

//   const handleInputChange = (index, field, value) => {
//     const updatedFormData = [...formData];
//     updatedFormData[index][field] = value;
//     setFormData(updatedFormData);
//   };

//   const handleCloseModal = () => {
//     setIsOpen(false);

//     setParentData([]);
//     setFormData([]);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search by name"
//         value={searchTerm}
//         onChange={handleSearch}
//         className="p-2 border border-gray-300 rounded mb-4"
//       />
//       {filteredStudents.length > 0 && (
//         <div className="max-h-60 overflow-y-auto border border-gray-300 rounded">
//           {filteredStudents.map((student, index) => (
//             <div
//               key={index}
//               className="p-2 border-b cursor-pointer hover:bg-gray-100"
//               onClick={() => handleStudentClick(student.parentAdmissionNumber)}
//             >
//               {student.fullName || "No Name"}, {student.class},{" "}
//               {student.fatherName}, {student.admissionNumber}
//             </div>
//           ))}
//         </div>
//       )}
//       {isOpen && (
//         <div
//           id="default-modal"
//           tabIndex="-1"
//           aria-hidden="true"
//           className="fixed top-0 right-0 left-0 z-[99999999] flex justify-center items-center w-full h-screen bg-gray-900 bg-opacity-50"
//         >
//           <div className="relative p-4 w-full max-h-full" data-aos="fade-down">
//             <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
//               <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                   Registration Form
//                 </h3>
//                 <button
//                   onClick={toggleModal}
//                   type="button"
//                   className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
//                 >
//                   <svg
//                     className="w-3 h-3"
//                     aria-hidden="true"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 14 14"
//                   >
//                     <path
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
//                     />
//                   </svg>
//                   <span className="sr-only">Close modal</span>
//                 </button>
//               </div>

//               <div className=" w-full ">
//                 <div className="flex-grow max-h-[80vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh]  overflow-auto ">
//                   {parentData.length > 0 && formData.length > 0 ? (
//                     <form
//                       onSubmit={handleSubmit}
//                       className=" flex md:flex-row flex-col w-full "
//                     >
//                       {parentData.map((child, index) => (
//                         <div
//                           key={index}
//                           className="bg-gray-200  m-3 w-full p-3"
//                         >
//                           <input
//                             type="checkbox"
//                             checked={selectedChildren.includes(index)}
//                             onChange={() => handleChildSelection(index)}
//                           />
//                           <p>
//                             <strong>Student:</strong> {child.fullName}
//                           </p>
//                           <p>
//                             <strong>Class:</strong> {child.class}
//                           </p>

//                           <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
//                             <div className="">
//                               <label className="block">Months</label>
//                               <Select
//                                 options={[
//                                   "January",
//                                   "February",
//                                   "March",
//                                   "April",
//                                   "May",
//                                   "June",
//                                   "July",
//                                   "August",
//                                   "September",
//                                   "October",
//                                   "November",
//                                   "December",
//                                 ].map((month) => ({
//                                   value: month,
//                                   label: month,
//                                 }))}
//                                 value={formData[index]?.selectedMonths?.map(
//                                   (month) => ({
//                                     value: month,
//                                     label: month,
//                                   })
//                                 )}
//                                 onChange={(selectedOptions) =>
//                                   handleInputChange(
//                                     index,
//                                     "selectedMonths",
//                                     selectedOptions.map(
//                                       (option) => option.value
//                                     )
//                                   )
//                                 }
//                                 isMulti
//                                 name="months"
//                                 className="basic-multi-select"
//                                 classNamePrefix="select"
//                               />
//                             </div>
//                             <div className="">
//                               <label className="block">Fee Date</label>
//                               <input
//                                 type="date"
//                                 value={
//                                   formData[index]?.feeDate || getCurrentDate()
//                                 }
//                                 onChange={(e) =>
//                                   handleInputChange(
//                                     index,
//                                     "feeDate",
//                                     e.target.value
//                                   )
//                                 }
//                                 className="p-2 border border-gray-300 rounded w-full"
//                               />
//                             </div>
// <div className="">
//   <label className="block">Payment Mode</label>
//   <select
//     value={formData[index]?.paymentMode || "Online"}
//     onChange={(e) =>
//       handleInputChange(
//         index,
//         "paymentMode",
//         e.target.value
//       )
//     }
//     className="p-2 border border-gray-300 rounded w-full"
//   >
//     <option value="Online">Online</option>
//     <option value="Cash">Cash</option>
//     <option value="Cheque">Cheque</option>
//   </select>
// </div>
//                             <div className="">
//                               <label className="block">
//                                 Select Additional Fees
//                               </label>
//                               <Select
//                                 options={allFees}
//                                 value={formData[index]?.selectedAdditionalFees}
//                                 onChange={(selectedOptions) =>
//                                   handleInputChange(
//                                     index,
//                                     "selectedAdditionalFees",
//                                     selectedOptions
//                                   )
//                                 }
//                                 isMulti
//                                 name="fees"
//                                 className="basic-multi-select"
//                                 classNamePrefix="select"
//                               />
//                             </div>
//                             <div className="">
//                               <label className="block">Amount Submitted</label>
//                               <input
//                                 type="number"
//                                 value={formData[index]?.amountSubmitted || 0}
//                                 onChange={(e) =>
//                                   handleInputChange(
//                                     index,
//                                     "amountSubmitted",
//                                     parseFloat(e.target.value) || 0
//                                   )
//                                 }
//                                 className="p-2 border border-gray-300 rounded w-full"
//                               />
//                             </div>
//                           </div>

//                           <hr className="my-4" />
//                         </div>
//                       ))}
//                     </form>
//                   ) : (
//                     <p>No parent or children data available.</p>
//                   )}
//                   <div className="w-full gap-5 grid grid-cols-1 md:grid-cols-2 p-4">
//                     <button
//                       type="submit"
//                       onClick={handleSubmit}
//                       className="bg-blue-500 w-full text-white px-4 py-2 rounded self-end"
//                     >
//                       Submit
//                     </button>
//                     <button
//                       type="submit"
//                       onClick={toggleModal}
//                       className="bg-gray-500 w-full text-white px-4 py-2 rounded self-end"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       ;
//     </div>
//   );
// };

// export default NewCheckFee;

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import Select from "react-select";
// const NewCheckFee = () => {
//     const [feeAmount, setFeeAmount] = useState();
//   const [allStudent, setAllStudent] = useState([]);
//   const [getFee, setGetFee] = useState({});
//   const getCurrentMonth = () => {
//     const today = new Date();
//     const month = today.toLocaleString("default", { month: "long" });
//     return month;
//   };
//   const [AdditionalFees, setAdditionalFees] = useState([]);
//   const [selectedMonths, setSelectedMonths] = useState([getCurrentMonth()]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [allFees, setAllFees] = useState([]);
//   const [selectedAdditionalFees, setSelectedAdditionalFees] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [parentData, setParentData] = useState([]);
//   const getCurrentDate = () => {
//     const today = new Date();
//     return today.toISOString().split("T")[0];
//   };
//   const [formData, setFormData] = useState({
//     admissionNumer: "",
//     feeAmount: feeAmount,
//     FeeMonth: "",
//     feeDate: getCurrentDate(),
//     feeStatus: "Paid",
//     paymentMode: "Online",
//   });
//   const authToken = Cookies.get("token");

//   useEffect(() => {
//     axios
//       .get(
//         "https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents",
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         setAllStudent(response.data.allStudent);
//         console.log(response.data.allStudent);
//       });
//   }, [authToken]);

//   useEffect(() => {
//     axios
//       .get(
//         "https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllFees",
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         const feesData = response.data.map((fee) => {
//             const label =
//               fee.name && fee.amount
//                 ? `${fee.name} (${fee.amount})`
//                 : "Unknown Fee";
//             const value = fee.amount ? fee.amount.toString() : "0";

//             return {
//               label,
//               value,
//             };
//           });

//           setAllFees(feesData);
//       });
//   }, [authToken]);
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (selectedMonths.length === 0) {
//       alert("Please select at least one month for regular fees.");
//       return;
//     }

//     const totalAmount = getTotalFeesAmount();
//     setFeeAmount(totalAmount);
//     const dues = totalAmount - formData.amountSubmitted;
//     const feeStatus = dues === 0 ? "Paid" : "Unpaid";

//     const newExamData = {
//       admissionNumber: selectedStudent.admissionNumber,
//       className: selectedStudent.class,
//       feeHistory: selectedMonths.map((month) => ({
//         paidAmount: formData.amountSubmitted,
//         month: month,
//         status: feeStatus,
//         date: formData.feeDate,
//         paymentMode: formData.paymentMode,
//       })),
//       dues: dues,
//     };

//     const apiUrl =
//       "https://eshikshaserver.onrender.com/api/v1/fees/createFeeStatus";
//     axios
//       .post(apiUrl, newExamData, {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       })
//       .then((response) => {
//         toast.success(response.data.message);
//         getFeeHistory();
//       })
//       .catch((error) => {
//         console.error("Error Posting Data: ", error);
//         toast.error(error.response.data.message);
//       });

//     setModalIsOpen(false);
//   };
//   const getTotalFeesAmount = () => {
//     const regularFeesAmount = getFee * selectedMonths.length;
//     const additionalFeesAmount = Array.isArray(selectedAdditionalFees)
//       ? selectedAdditionalFees.reduce(
//           (total, fee) => total + parseFloat(fee.value),
//           0
//         )
//       : 0;

//     return regularFeesAmount + additionalFeesAmount;
//   };

//   const handleMonthsChange = (selectedOptions) => {
//     setSelectedMonths(selectedOptions.map((option) => option.value));
//   };
//   const handleAdditionalFeesChange = (selectedOptions) => {
//     setSelectedAdditionalFees(selectedOptions);
//   };
//   const handleAmountSubmittedChange = (e) => {
//     setFormData({ ...formData, amountSubmitted: e.target.value });
//   };
//   const handleDateChange = (e) => {
//     setFormData({ ...formData, feeDate: e.target.value });
//   };
//   const handleSearch = (event) => {
//     const searchValue = event.target.value.toLowerCase().trim();
//     setSearchTerm(searchValue);

//     if (searchValue === "") {
//       setFilteredStudents([]);
//     } else {
//       const filtered = allStudent.filter(
//         (student) =>
//           student.fullName &&
//           student.fullName.toLowerCase().includes(searchValue)
//       );
//       setFilteredStudents(filtered);
//     }
//   };

//   const handleStudentClick = (admissionNumber) => {
//     axios
//       .get(
//         `https://eshikshaserver.onrender.com/api/v1/adminRoute/getParentWithChildren/${admissionNumber}`,
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         setParentData(response.data.children);
//         console.log("parent", response.data.children);
//         setOpenModal(true); // Open the modal
//       });
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setParentData(null);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search by name"
//         value={searchTerm}
//         onChange={handleSearch}
//         className="p-2 border border-gray-300 rounded mb-4"
//       />
//       {filteredStudents.length > 0 && (
//         <div className="max-h-60 overflow-y-auto border border-gray-300 rounded">
//           {filteredStudents.map((student, index) => (
//             <div
//               key={index}
//               className="p-2 border-b cursor-pointer hover:bg-gray-100"
//               onClick={() => handleStudentClick(student.parentAdmissionNumber)}
//             >
//               {student.fullName || "No Name"}, {student.class},{" "}
//               {student.fatherName}, {student.admissionNumber}
//             </div>
//           ))}
//         </div>
//       )}

//       <Modal
//         open={openModal}
//         onClose={handleCloseModal}
//         aria-labelledby="parent-child-modal"
//         aria-describedby="modal-for-parent-child-data"
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             boxShadow: 24,
//             p: 4,
//             borderRadius: "8px",
//           }}
//         >
//           <h2 id="parent-child-modal-title">Parent and Children Details</h2>
//           {parentData ? (
//             <div>
//               {parentData.map((children) => (
//                 <>
//                   <p>
//                     <strong>child Name:</strong> {children.fullName}
//                   </p>
//                   <p>
//                     <strong>child class:</strong> {children.class}
//                   </p>
//   <form>
//   <div className="text-center">
//     <h1 className="text-2xl font-semibold mb-4 text-white ">
//       Create Fee
//     </h1>
//   </div>
//   <div className=" flex justify-between">
//     <label className="block text-white dark:text-white">
//       Regular Fee :{" "}
//       {Array.isArray(getFee) && getFee.length > 0 ? (
//         ` ${getFee} `
//       ) : (
//         <p>No fee data available</p>
//       )}
//     </label>
//     <div className="">
//       <label className="block text-white dark:text-white ">
//         Dues : {getTotalFeesAmount() - formData.amountSubmitted}
//       </label>
//     </div>
//   </div>

//   <div className="grid md:grid-cols-2 grid-cols-1 gap-4 ">
//     <div className="">
//       <label className="block text-white dark:text-white">
//         Months
//       </label>
//       <Select
//         className="dark:bg-secondary-dark-bg "
//         options={[
//           "January",
//           "February",
//           "March",
//           "April",
//           "May",
//           "June",
//           "July",
//           "August",
//           "September",
//           "October",
//           "November",
//           "December",
//         ].map((month) => ({
//           value: month,
//           label: month,
//         }))}
//         value={selectedMonths.map((month) => ({
//           value: month,
//           label: month,
//         }))}
//         onChange={handleMonthsChange}
//         isMulti
//         placeholder="Select months"
//       />
//     </div>
//     <div className="">
//       <label className="block text-white">
//         Additional Fees
//       </label>
//       <Select
//         id="additional-fees"
//         options={AdditionalFees}
//         value={selectedAdditionalFees}
//         onChange={handleAdditionalFeesChange}
//         isMulti={true}
//         placeholder="Select additional fees"
//       />
//     </div>
//     <div className="">
//       <label className="block text-white">Fee Status</label>
//       <select
//         className="w-full border rounded-lg p-2  dark:bg-secondary-dark-bg  dark:text-white"
//         value={formData.feeStatus || "Unpaid"}
//         onChange={(e) =>
//           setFormData({
//             ...formData,
//             feeStatus: e.target.value,
//           })
//         }
//       >
//         <option
//           value="Paid"
//           className=" dark:bg-secondary-dark-bg  dark:text-white"
//         >
//           Paid
//         </option>
//         <option
//           value="Unpaid"
//           className=" dark:bg-secondary-dark-bg  dark:text-white"
//         >
//           Unpaid
//         </option>
//       </select>
//     </div>
//     <div>
//       <label className="block text-white">Payment Mode</label>
//       <select
//         className="w-full border rounded-lg p-2"
//         value={formData.paymentMode || "Cash"}
//         onChange={(e) =>
//           setFormData({
//             ...formData,
//             paymentMode: e.target.value,
//           })
//         }
//       >
//         <option value="Cash">Cash</option>
//         <option value="Online">Online</option>
//       </select>
//     </div>
//     <div className="md:mb-4">
//       <label className="block text-white">
//         Amount Submitted
//       </label>
//       <input
//         type="number"
//         className="w-full border rounded-lg p-2 dark:bg-secondary-dark-bg dark:text-white"
//         value={formData.amountSubmitted}
//         // value={formData.amountSubmitted || getFee}
//         onChange={handleAmountSubmittedChange}
//       />
//     </div>
//     <div className="md:mb-4 m-0">
//       <label className="block text-white">Fee Date</label>
//       <input
//         type="date"
//         className="w-full border rounded-lg p-2"
//         value={formData.feeDate}
//         onChange={handleDateChange}
//       />
//     </div>
//     <p className="text-white font-bold">
//       {" "}
//       Total Fees Amount : {getTotalFeesAmount()}
//     </p>
//   </div>
//   {/* </div> */}
//   <div className="text-right space-x-3">
//     <button
//       className="dark:text-white dark:bg-secondary-dark-bg text-gray-800  neu-btn border-2 mb-2"
//       style={{
//         border: `2px solid  `,

//       }}
//       //  className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
//       onClick={handleSubmit}
//     >
//       Submit
//     </button>
//     <button
//     //   onClick={closeModal}
//       className="dark:text-white dark:bg-secondary-dark-bg text-gray-800  neu-btn border-2 mb-2 border-gray-500"
//     >
//       Close
//     </button>
//   </div>
// </form>
//                 </>
//               ))}
//             </div>
//           ) : (
//             <p>Loading...</p>
//           )}
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default NewCheckFee;

// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import Cookies from "js-cookie";

// const NewCheckFee = () => {
//     const [allStudent, setAllStudent] = useState([]);
//     const [filteredStudents, setFilteredStudents] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const authToken = Cookies.get("token");

//     useEffect(() => {
//         axios.get("https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents", {
//             withCredentials: true,
//             headers: {
//                 Authorization: `Bearer ${authToken}`,
//             },
//         }).then((response) => {
//             // console.log("firstresopnse", response.data.allStudent);
//             setAllStudent(response.data.allStudent);
//         });
//     }, [authToken]);
//     useEffect(() => {
//         axios.get(`https://eshikshaserver.onrender.com/api/v1/adminRoute/getParentWithChildren/${"QAW854"}`, {
//             withCredentials: true,
//             headers: {
//                 Authorization: `Bearer ${authToken}`,
//             },
//         }).then((response) => {
//             console.log("firstresopnse", response.data.children);
//             // setAllStudent(response.data.allStudent);
//         });
//     }, [authToken]);

//     const handleSearch = (event) => {
//         const searchValue = event.target.value.toLowerCase().trim();
//         setSearchTerm(searchValue);

//         if (searchValue.trim() === "") {
//             setFilteredStudents([]);
//         } else {
//             const filtered = allStudent.filter(student =>
//                 student.fullName && student.fullName.toLowerCase().includes(searchValue)
//             );
//             setFilteredStudents(filtered);
//         }
//     };

//     return (
//         <div>
//             <input
//                 type="text"
//                 placeholder="Search by name"
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="p-2 border border-gray-300 rounded mb-4"
//             />
//             {filteredStudents.length > 0 && (
//                 <div className="max-h-60 overflow-y-auto border border-gray-300 rounded">
//                     {filteredStudents.map((student, index) => (
//                         <div key={index} className="p-2 border-b">
//                             {student.fullName || "No Name"},{student.class},{student.fatherName},{student.admissionNumber}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default NewCheckFee;

// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import Cookies from "js-cookie";

// const NewCheckFee = () => {
//     const [allStudent, setAllStudent] = useState([]);
//     const [filteredStudents, setFilteredStudents] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const authToken = Cookies.get("token");

//     useEffect(() => {
//         axios.get("https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents", {
//             withCredentials: true,
//             headers: {
//                 Authorization: `Bearer ${authToken}`,
//             },
//         }).then((response) => {
//             console.log("firstresopnse", response.data.allStudent);
//             setAllStudent(response.data.allStudent);
//         });
//     }, [authToken]);

//     const handleSearch = (event) => {
//         const searchValue = event.target.value.toLowerCase().trim();
//         setSearchTerm(searchValue);

//         if (searchValue.trim() === "") {
//             setFilteredStudents([]);
//         } else {
//             const filtered = allStudent.filter(student =>
//                 student.fullName && student.fullName.toLowerCase().includes(searchValue)
//             );
//             setFilteredStudents(filtered);
//         }
//     };

//     return (
//         <div>
//             <input
//                 type="text"
//                 placeholder="Search by name"
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="p-2 border border-gray-300 rounded mb-4"
//             />
//             {filteredStudents.length > 0 && (
//                 <div className="max-h-60 overflow-y-auto border border-gray-300 rounded">
//                     {filteredStudents.map((student, index) => (
//                         <div key={index} className="p-2 border-b">
//                             {student.fullName || "No Name"},{student.class},{student.fatherName},{student.admissionNumber}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default NewCheckFee;

// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import Cookies from "js-cookie";
// const NewCheckFee = () => {
//     const [allStudent,setAllStudent]=useState([])
//     const authToken = Cookies.get("token");
//     useEffect(()=>{
//             axios.get("https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents",{
//                 withCredentials: true,
//                 headers: {
//                   Authorization: `Bearer ${authToken}`,
//                 },
//               }).then((resopnse)=>{
//             console.log("firstresopnse",resopnse.data.allStudent)
//             setAllStudent(resopnse.data.allStudent)
//             })
//     },[])
//   return (
//     <div>NewCheckFee</div>
//   )
// }

// export default NewCheckFee
