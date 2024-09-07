import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Select from "react-select";
import { toast } from "react-toastify";

const StockTable = () => {
  const [allFees, setAllFees] = useState([]); // State to store fees data
  const [selectedItems, setSelectedItems] = useState([]); // State for selected items
  const [totalAmount, setTotalAmount] = useState(0); // State for total amount
  const [name, setName] = useState(""); // State for name input

  const authToken = Cookies.get("token");

  useEffect(() => {
    // Fetch all items (fees) when the component mounts
    axios
      .get(
        "https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllItems",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        const feesData = response.data.listOfAllItems.map((item) => {
          return {
            label: item.itemName,
            value: item._id, // Use ID for internal tracking
            price: item.price,
          };
        });
        setAllFees(feesData);
      })
      .catch((error) => {
        console.error("Error fetching fees data:", error);
        toast.error("Failed to fetch fees data.");
      });
  }, [authToken]);

  const handleSelectChange = (selectedOptions) => {
    const updatedItems = selectedOptions.map(option => ({
      ...option,
      quantity: 1, // Default quantity
    }));
    setSelectedItems(updatedItems);
    updateTotalAmount(updatedItems);
  };

  const handleIncrement = (index) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].quantity += 1;
    setSelectedItems(updatedItems);
    updateTotalAmount(updatedItems);
  };

  const handleDecrement = (index) => {
    const updatedItems = [...selectedItems];
    if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;
      setSelectedItems(updatedItems);
      updateTotalAmount(updatedItems);
    }
  };

  const updateTotalAmount = (items) => {
    const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalAmount(amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Prepare the data to be posted
    const dataToPost = {
      name: name,
      items: selectedItems.map(item => ({
        name: item.label,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      })),
      totalAmount: totalAmount,
    };

    // Send POST request
    axios
      .post("https://eshikshaserver.onrender.com/api/v1/inventory/createsellItem", dataToPost, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        toast.success("Data successfully posted.");
        // Reset form fields
        setSelectedItems([]);
        setName("");
        setTotalAmount(0);
      })
      .catch((error) => {
        console.error("Error posting data:", error);
        toast.error("Failed to post data.");
      });
  };

  return (
    <div className="md:min-h-screen px-5 pl-10 md:pl-0 md:px-0">
      <div className="flex-grow max-h-[80vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh] overflow-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap md:flex-row flex-col w-full gap-4"
        >
          <div className="mb-2 p-2 bg-gray-100 rounded">
            <label className="block text-[12px] font-medium text-gray-700 mt-2">
              Select Items:
            </label>
            <Select
              isMulti
              options={allFees}
              className="basic-single mt-2"
              classNamePrefix="select"
              onChange={handleSelectChange}
            />
            <div className="mt-2">
              {selectedItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 mb-2 p-2 border border-gray-300 rounded">
                  <span>{item.label}</span>
                  <span>₹{item.price}</span>
                  <button
                    onClick={() => handleDecrement(index)}
                    className="bg-red-500 text-white  rounded-full  h-7 w-7 "
                    type="button" // Ensure this button doesn't submit the form
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(index)}
                    className="bg-green-500 text-white h-7 w-7  rounded-full"
                    type="button" // Ensure this button doesn't submit the form
                  >
                    +
                  </button>
                  <span>₹{item.price * item.quantity}</span> {/* Display amount for the item */}
                </div>
              ))}
              <div className="mt-4">
                <label className="block text-[12px] font-medium text-gray-700">
                  Name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                 className="border border-gray-300 px-2 py-1  rounded"
                />
              </div>
              <div className="mt-4">
                <label className="block text-[12px] font-medium text-gray-700">
                  Total Amount: ₹{totalAmount}
                </label>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-gray-800 text-white p-2 rounded"
                >
                  Sell
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockTable;



// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import Select from "react-select";
// import { toast } from "react-toastify";

// const StockTable = () => {
//   const [allFees, setAllFees] = useState([]); // State to store fees data
//   const [selectedItems, setSelectedItems] = useState([]); // State for selected items
//   const [totalAmount, setTotalAmount] = useState(0); // State for total amount
//   const [name, setName] = useState(""); // State for name input

//   const authToken = Cookies.get("token");

//   useEffect(() => {
//     // Fetch all items (fees) when the component mounts
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
//         const feesData = response.data.listOfAllItems.map((item) => {
//           return {
//             label: item.itemName,
//             value: item._id, // Use ID for internal tracking
//             price: item.price,
//           };
//         });
//         setAllFees(feesData);
//       })
//       .catch((error) => {
//         console.error("Error fetching fees data:", error);
//         toast.error("Failed to fetch fees data.");
//       });
//   }, [authToken]);

//   const handleSelectChange = (selectedOptions) => {
//     const updatedItems = selectedOptions.map(option => ({
//       ...option,
//       quantity: 1, // Default quantity
//     }));
//     setSelectedItems(updatedItems);
//     updateTotalAmount(updatedItems);
//   };

//   const handleIncrement = (index) => {
//     const updatedItems = [...selectedItems];
//     updatedItems[index].quantity += 1;
//     setSelectedItems(updatedItems);
//     updateTotalAmount(updatedItems);
//   };

//   const handleDecrement = (index) => {
//     const updatedItems = [...selectedItems];
//     if (updatedItems[index].quantity > 1) {
//       updatedItems[index].quantity -= 1;
//       setSelectedItems(updatedItems);
//       updateTotalAmount(updatedItems);
//     }
//   };

//   const updateTotalAmount = (items) => {
//     const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//     setTotalAmount(amount);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Prepare the data to be posted
//     const dataToPost = {
//       name: name,
//       items: selectedItems.map(item => ({
//         name: item.label,
//         price: item.price,
//         quantity: item.quantity,
//         total: item.price * item.quantity,
//       })),
//       totalAmount: totalAmount,
//     };

//     // Send POST request
//     axios
//       .post("https://eshikshaserver.onrender.com/api/v1/adminRoute/postSelectedItems", dataToPost, {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       })
//       .then((response) => {
//         toast.success("Data successfully posted.");
//         // Reset form fields
//         setSelectedItems([]);
//         setName("");
//         setTotalAmount(0);
//       })
//       .catch((error) => {
//         console.error("Error posting data:", error);
//         toast.error("Failed to post data.");
//       });
//   };

//   return (
//     <div className="md:min-h-screen px-5 pl-10 md:pl-0 md:px-0">
//       <div className="flex-grow max-h-[80vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh] overflow-auto">
//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-wrap md:flex-row flex-col w-full gap-4"
//         >
//           <div className="mb-2 p-2 bg-gray-100 rounded">
//             <label className="block text-[12px] font-medium text-gray-700 mt-2">
//               Select Items:
//             </label>
//             <Select
//               isMulti
//               options={allFees}
//               className="basic-single mt-2"
//               classNamePrefix="select"
//               onChange={handleSelectChange}
//             />
//             <div className="mt-2">
//               {selectedItems.map((item, index) => (
//                 <div key={index} className="flex items-center gap-4 mb-2 p-2 border border-gray-300 rounded">
//                   <span>{item.label}</span>
//                   <span>₹{item.price}</span>
//                   <button
//                     onClick={() => handleDecrement(index)}
//                     className="bg-red-500 text-white p-2 rounded"
//                   >
//                     -
//                   </button>
//                   <span>{item.quantity}</span>
//                   <button
//                     onClick={() => handleIncrement(index)}
//                     className="bg-green-500 text-white p-2 rounded"
//                   >
//                     +
//                   </button>
//                   <span>₹{item.price * item.quantity}</span> {/* Display amount for the item */}
//                 </div>
//               ))}
//               <div className="mt-4">
//                 <label className="block text-[12px] font-medium text-gray-700">
//                   Name:
//                 </label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="border border-gray-300 p-2 rounded w-full"
//                 />
//               </div>
//               <div className="mt-4">
//                 <label className="block text-[12px] font-medium text-gray-700">
//                   Total Amount: ₹{totalAmount}
//                 </label>
//               </div>
//               <div className="mt-4">
//                 <button
//                   type="submit"
//                   className="bg-gray-800 text-white p-2 rounded"
//                 >
//                   Sell
//                 </button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StockTable;



// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import Select from "react-select";
// import { toast } from "react-toastify";

// const StockTable = () => {
//   const [allFees, setAllFees] = useState([]); // State to store fees data
//   const [selectedItems, setSelectedItems] = useState([]); // State for selected items
//   const [totalAmount, setTotalAmount] = useState(0); // State for total amount

//   const authToken = Cookies.get("token");

//   useEffect(() => {
//     // Fetch all items (fees) when the component mounts
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
//         const feesData = response.data.listOfAllItems.map((item) => {
//           return {
//             label: item.itemName,
//             value: item._id, // Use ID for internal tracking
//             price: item.price,
//           };
//         });
//         setAllFees(feesData);
//       })
//       .catch((error) => {
//         console.error("Error fetching fees data:", error);
//         toast.error("Failed to fetch fees data.");
//       });
//   }, [authToken]);

//   const handleSelectChange = (selectedOptions) => {
//     const updatedItems = selectedOptions.map(option => ({
//       ...option,
//       quantity: 1, // Default quantity
//     }));
//     setSelectedItems(updatedItems);
//     updateTotalAmount(updatedItems);
//   };

//   const handleIncrement = (index) => {
//     const updatedItems = [...selectedItems];
//     updatedItems[index].quantity += 1;
//     setSelectedItems(updatedItems);
//     updateTotalAmount(updatedItems);
//   };

//   const handleDecrement = (index) => {
//     const updatedItems = [...selectedItems];
//     if (updatedItems[index].quantity > 1) {
//       updatedItems[index].quantity -= 1;
//       setSelectedItems(updatedItems);
//       updateTotalAmount(updatedItems);
//     }
//   };

//   const updateTotalAmount = (items) => {
//     const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//     setTotalAmount(amount);
//   };

//   return (
//     <div className="md:min-h-screen px-5 pl-10 md:pl-0 md:px-0">
//       <div className="flex-grow max-h-[80vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh] overflow-auto">
//         <form
//           onSubmit={(e) => e.preventDefault()}
//           className="flex flex-wrap md:flex-row flex-col w-full gap-4"
//         >
//           <div className="mb-2 p-2 bg-gray-100 rounded">
//             <label className="block text-[12px] font-medium text-gray-700 mt-2">
//               Select Items:
//             </label>
//             <Select
//               isMulti
//               options={allFees}
//               className="basic-single mt-2"
//               classNamePrefix="select"
//               onChange={handleSelectChange}
//             />
//             <div className="mt-2">
//               {selectedItems.map((item, index) => (
//                 <div key={index} className="flex items-center gap-4 mb-2 p-2 border border-gray-300 rounded">
//                   <span>{item.label}</span>
//                   <span>₹{item.price}</span>
//                   <button
//                     onClick={() => handleDecrement(index)}
//                     className="bg-red-500 text-white p-2 rounded"
//                   >
//                     -
//                   </button>
//                   <span>{item.quantity}</span>
//                   <button
//                     onClick={() => handleIncrement(index)}
//                     className="bg-green-500 text-white p-2 rounded"
//                   >
//                     +
//                   </button>
//                   <span>₹{item.price * item.quantity}</span> {/* Display amount for the item */}
//                 </div>
//               ))}
//               <div>
//               <label className="block text-[12px] font-medium text-gray-700">
//                   Name
//                 </label>
// <input type="text" />
//       </div>
//               <div className="mt-4">
//                 <label className="block text-[12px] font-medium text-gray-700">
//                   Total Amount: ₹{totalAmount}
//                 </label>
//               </div>
//               <div>
//              <button className="bg-gray-800 text-white">sell</button>
//               </div>
//             </div>
//           </div>
     
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StockTable;



// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import Select from "react-select";
// import { toast } from "react-toastify";

// const StockTable = () => {
//   const [allFees, setAllFees] = useState([]); // State to store fees data
//   const [selectedItems, setSelectedItems] = useState([]); // State for selected items
//   const [totalAmount, setTotalAmount] = useState(0); // State for total amount

//   const authToken = Cookies.get("token");

//   useEffect(() => {
//     // Fetch all items (fees) when the component mounts
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
//         const feesData = response.data.listOfAllItems.map((item) => {
//           return {
//             label: item.itemName,
//             value: item._id, // Use ID for internal tracking
//             price: item.price,
//           };
//         });
//         setAllFees(feesData);
//       })
//       .catch((error) => {
//         console.error("Error fetching fees data:", error);
//         toast.error("Failed to fetch fees data.");
//       });
//   }, [authToken]);

//   const handleSelectChange = (selectedOptions) => {
//     const updatedItems = selectedOptions.map(option => ({
//       ...option,
//       quantity: 1, // Default quantity
//     }));
//     setSelectedItems(updatedItems);
//     updateTotalAmount(updatedItems);
//   };

//   const handleIncrement = (index) => {
//     const updatedItems = [...selectedItems];
//     updatedItems[index].quantity += 1;
//     setSelectedItems(updatedItems);
//     updateTotalAmount(updatedItems);
//   };

//   const handleDecrement = (index) => {
//     const updatedItems = [...selectedItems];
//     if (updatedItems[index].quantity > 1) {
//       updatedItems[index].quantity -= 1;
//       setSelectedItems(updatedItems);
//       updateTotalAmount(updatedItems);
//     }
//   };

//   const updateTotalAmount = (items) => {
//     const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//     setTotalAmount(amount);
//   };

//   return (
//     <div className="md:min-h-screen px-5 pl-10 md:pl-0 md:px-0">
//       <div className="flex-grow max-h-[80vh] sm:max-h-[80vh] md:max-h-[80vh] lg:max-h-[80vh] overflow-auto">
//         <form
//           onSubmit={(e) => e.preventDefault()}
//           className="flex flex-wrap md:flex-row flex-col w-full gap-4"
//         >
//           <div className="mb-2 p-2 bg-gray-100 rounded">
//             <label className="block text-[12px] font-medium text-gray-700 mt-2">
//               Select Items:
//             </label>
//             <Select
//               isMulti
//               options={allFees}
//               className="basic-single mt-2"
//               classNamePrefix="select"
//               onChange={handleSelectChange}
//             />
//             <div className="mt-2">
//               {selectedItems.map((item, index) => (
//                 <div key={index} className="flex items-center gap-4 mb-2 p-2 border border-gray-300 rounded">
//                   <span>{item.label}</span>
//                   <span>₹{item.price}</span>
//                   <button
//                     onClick={() => handleDecrement(index)}
//                     className="bg-red-500 text-white p-2 rounded"
//                   >
//                     -
//                   </button>
//                   <span>{item.quantity}</span>
//                   <button
//                     onClick={() => handleIncrement(index)}
//                     className="bg-green-500 text-white p-2 rounded"
//                   >
//                     +
//                   </button>
//                 </div>
//               ))}
//               <div className="mt-4">
//                 <label className="block text-[12px] font-medium text-gray-700">
//                   Total Amount: ₹{totalAmount}
//                 </label>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StockTable;


// import React, { useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import IconButton from "@mui/material/IconButton";
// import axios from "axios";
// import Cookies from "js-cookie";
// const authToken = Cookies.get("token");

// function StockTable({ data, handleDelete, updateDependency }) {
//   data.map((item) => {});

//   const [counts, setCounts] = useState({});

//   const decrement = (id) => {
//     setCounts((prevCounts) => {
//       const newCounts = { ...prevCounts };
//       if (newCounts[id] > 0) {
//         newCounts[id] -= 1;
//       }
//       return newCounts;
//     });
//   };

//   const increment = (id) => {
//     setCounts((prevCounts) => {
//       const newCounts = { ...prevCounts };
//       newCounts[id] = (newCounts[id] || 0) + 1;
//       return newCounts;
//     });
//   };

//   const handleSell = (row) => {
//     const sellQuantity = counts[row.id];
//     const totalAmount = counts[row.id] * row.price;
//     const quantity = row.quantity - counts[row.id];

    // const postData = {
    //   itemName: row.itemName,
    //   category: row.category,
    //   quantity: quantity,
    //   price: row.price,
    //   sellQuantity: sellQuantity,
    //   totalAmount: totalAmount,
    //   itemId: row._id,
    // };

//     axios
//       .post(
//         "https://eshikshaserver.onrender.com/api/v1/inventory/createsellItem",
//         postData,
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         setCounts(0);
//         updateDependency();
//       })
//       .catch((error) => {
//         console.error("Sell request failed", error);
//       });
//   };

//   const columns = [
//     { field: "id", headerName: "S. No.", flex: 1 },
//     { field: "itemName", headerName: "Item Name", flex: 1 },
//     { field: "category", headerName: "Category", flex: 1 },
//     { field: "quantity", headerName: "Quantity", flex: 1 },
//     { field: "price", headerName: "Price", flex: 1 },
//     { field: "sellAmount", headerName: "Total Sale", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <div className="flex justify-center items-center">
//           <button
//             className="w-8 h-8 bg-green-400 text-white rounded-full"
//             onClick={() => decrement(params.row.id)}
//           >
//             -
//           </button>

//           <p className="px-2">{counts[params.row.id] || 0}</p>
//           <button
//             className="w-8 h-8 bg-green-400 text-white rounded-full"
//             onClick={() => increment(params.row.id)}
//           >
//             +
//           </button>
//         </div>
//       ),
//     },

//     {
//       field: "amount",
//       headerName: "Total Amount",
//       width: 100,
//       renderCell: (params) => {
//         const totalAmount = (counts[params.row.id] || 0) * params.row.price;

//         return (
//           <div className="flex justify-center items-center p-5">
//             <p>{totalAmount}</p>
//           </div>
//         );
//       },
//     },

//     {
//       field: "sell",
//       headerName: "Sell",
//       width: 100,
//       renderCell: (params) => (
//         <div className="flex justify-center items-center">
//           <IconButton onClick={() => handleSell(params.row)} color="primary">
//             Sell
//           </IconButton>
//         </div>
//       ),
//     },
//   ];

//   const dataWithIds = Array.isArray(data)
//     ? data.map((item, index) => ({ id: index + 1, ...item }))
//     : [];

//   return (
//     <div className="h-[450px] dark:text-white dark:bg-secondary-dark-bg mx-auto bg-white mt-2 rounded-md overflow-scroll w-full">
//       <div className=" min-w-[1000px]  w-full">
//         <DataGrid rows={dataWithIds} columns={columns} />
//       </div>
//     </div>
//   );
// }

// export default StockTable;
