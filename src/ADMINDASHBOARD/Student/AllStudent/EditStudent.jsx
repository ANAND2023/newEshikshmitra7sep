import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { usePDF } from "react-to-pdf";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
const authToken = Cookies.get('token');

const EditStudent = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const [studentData, setStudentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    rollNo: "",
    gender: "",
    joiningDate: "",
    address: "",
    contact: "",
    class: "",
    section: "",
    country: "",
    subject: "",
    image: null,
  });

  const { toPDF, targetRef } = usePDF({ filename: "Student.pdf" });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        studentImage: file,
      });
    }
  };

  useEffect(() => {
    axios
      .get(
        `https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents?email=${email}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        const data = response.data.allStudent[0];
        setStudentData(data);
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...data,
        }));
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });
  }, [email]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    // Exclude image from formData
    const { image, ...formDataWithoutImage } = formData;

    // Append other form data to the FormData
    for (const key in formDataWithoutImage) {
      data.append(key, formDataWithoutImage[key]);
    }

    // Append image as a separate file
    if (image && typeof image === 'object' && image instanceof File) {
      data.append("image", image);
    }

    axios
      .put(`https://eshikshaserver.onrender.com/api/v1/adminRoute/updateStudent`, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        }
      })
      .then((response) => {
        navigate("/admin/allstudent");
        toast.success("Updated Successfully")
      })
      .catch((error) => {
        console.error("Error updating student data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  

  return (
    <div className="text-center p-5">
      <h1 className="text-3xl font-bold mb-6">Edit Student Profile</h1>
      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <div className="py-5 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-4 bg-white rounded-md shadow-lg">
          <div className="mb-4">
            <label className="block text-gray-700">FullName</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border rounded"
             
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Roll No</label>
            <input
              type="text"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border rounded"
           
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border rounded"
             
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date Of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border rounded"
              //
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Gender</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border rounded"
             
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border rounded"
             
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border rounded"
             
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border rounded"
             
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border rounded"
             
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border rounded"
             
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Class</label>
            <input
              type="text"
              name="class"
              value={formData.class}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border rounded"
             
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Section</label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border rounded"
             
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Student Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded"
              //
            />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <Link
            to="/admin/allstudent"
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-300 ml-4"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;



// import React, { useState, useEffect, useRef } from "react";
// import { Box, Button, TextField, Select, MenuItem } from "@mui/material";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { usePDF } from "react-to-pdf";
// import Cookies from 'js-cookie';
// const authToken = Cookies.get('token');

// const EditStudent = () => {
//   const navigate = useNavigate();
//   const { email } = useParams();
//   const [studentData, setStudentData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     // studentEmail: "",
//     // studentPassword: "",
//     dateOfBirth: "",
//     rollNo: "",
//     gender: "",
//     joiningDate: "",
//     address: "",
//     contact: "",
//     class: "",
//     section: "",
//     country: "",
//     subject: "",
//     // fatherName: "",
//     // motherName: "",
//     // parentEmail: "",
//     // parentPassword: "",
//     // parentContact: "",
//     image: null,
//     // parentImage: "",
//   });

//   const { toPDF, targetRef } = usePDF({ filename: "Student.pdf" });

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     console.log("File:", file); // Check if 'file' is not undefined
//     if (file) {
//       console.log("Updating studentImage with file:", file);
//       setFormData({
//         ...formData,
//         studentImage: file,
//       });
//       console.log(formData);
//     }
//   };

//   useEffect(() => {
//     axios
//       .get(
//         `https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllStudents?email=${email}`,
//         {
//           withCredentials: true,
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//         }
//       )
//       .then((response) => {
//         const data = response.data.allStudent[0];
//         console.log("Students", data);
//         setStudentData(data);
//         setFormData((prevFormData) => ({
//           ...prevFormData,
//           ...data,
//         }));
//       })
//       .catch((error) => {
//         console.error("Error fetching teacher data:", error);
//       });
//   }, [email]);

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);
  
//     const data = new FormData();
  
//     // Exclude image from formData
//     const { image, ...formDataWithoutImage } = formData;
  
//     // Append other form data to the FormData
//     for (const key in formDataWithoutImage) {
//       data.append(key, formDataWithoutImage[key]);
//     }
  
//     // Append image as a separate file
//     if (image && typeof image === 'object' && image instanceof File) {
//       data.append("image", image);
//     }
  
//     axios
//       .put(`https://eshikshaserver.onrender.com/api/v1/adminRoute/updateStudent`, data, {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//           "Content-Type": "multipart/form-data",
//         }
//       })
//       .then((response) => {
//         console.log("Student data updated successfully", response);
//         navigate("/admin/allstudent");
//       })
//       .catch((error) => {
//         console.error("Error updating student data:", error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };
  
  

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <h1 style={{ fontSize: "30px", fontWeight: "900" }}>
//         Edit Student Profile
//       </h1>
//       <form onSubmit={handleFormSubmit} encType="multipart/form-data">
//         <Box className="py-5 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-4 bg-white rounded-md shadow-lg">
//           <TextField
//             label="FullName"
//             name="fullName"
//             type="text"
//             value={formData.fullName}
//             onChange={handleOnChange}
//            
//             style={{ width: "70%", paddingBottom: "20px" }}
//           />
//           <TextField
//             label="Roll No"
//             name="rollNo"
//             type="text"
//             value={formData.rollNo}
//             onChange={handleOnChange}
//            
//             style={{ width: "70%", paddingBottom: "20px" }}
//           />
//           <TextField
//             label="Email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleOnChange}
//            
//             readOnly // Ensure 'readOnly' is set here
//             style={{ width: "70%", paddingBottom: "20px" }}
//           />
//           <TextField
//             label="DateOfBirth"
//             name="dateOfBirth"
//             type="date"
//             onChange={handleOnChange}
//            
//             style={{ width: "70%", paddingBottom: "20px" }}
//           />
//           <TextField
//             label="Gender"
//             name="gender"
//             value={formData.gender}
//             onChange={handleOnChange}
//            
//             style={{ width: "70%", paddingBottom: "20px" }}
//           />
//           <TextField
//             label="Subject"
//             name="subject"
//             value={formData.subject}
//             onChange={handleOnChange}
//            
//             style={{ width: "70%", paddingBottom: "20px" }}
//           />
//           <TextField
//             label="Joining Date"
//             name="joiningDate"
//             value={formData.joiningDate}
//             onChange={handleOnChange}
//            
//             style={{ width: "70%", paddingBottom: "20px" }}
//           />
//           <TextField
//             label="Address"
//             name="address"
//             value={formData.address}
//             onChange={handleOnChange}
//            
//             style={{ width: "70%", paddingBottom: "20px" }}
//           />
//           <TextField
//             label="Country"
//             name="country"
//             value={formData.country}
//             onChange={handleOnChange}
//            
//             style={{ width: "70%", paddingBottom: "20px" }}
//           />
//           <TextField
//             label="Contact"
//             name="contact"
//             value={formData.contact}
//             onChange={handleOnChange}
//            
//             style={{ width: "70%", paddingBottom: "20px" }}
//           />
//           <TextField
//             label="Class"
//             name="class"
//             value={formData.class}
//             onChange={handleOnChange}
//            
//             style={{ width: "70%", paddingBottom: "20px" }}
//           />
//           <TextField
//             label="Section"
//             name="section"
//             value={formData.section}
//             onChange={handleOnChange}
//            
//             style={{ width: "70%", paddingBottom: "20px" }}
//           />
//           <TextField
//             label="Student Image"
//             name="image"
//             type="file"
//             accept="image/*"
//            
//             onChange={handleImageChange}
//             style={{ width: "70%", paddingBottom: "20px" }}
//           />
//         </Box>
//         <Link to="/admin/allstudent">
//           <div className="button flex w-full" style={{ marginTop: "10px" }}>
//             <Button
//               variant="contained"
//               onClick={handleFormSubmit}
//               style={{ width: "50%", marginRight: "10px" }}
//             >
//               Update
//             </Button>
//             <Button variant="contained" style={{ width: "50%" }}>
//               Cancel
//             </Button>
//           </div>
//         </Link>
//       </form>
//     </div>
//   );
// };

// export default EditStudent;