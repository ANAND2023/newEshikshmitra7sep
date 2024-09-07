import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Switch from '@mui/material/Switch';

import axios from "axios";
import "../../Dynamic/Form/FormStyle.css";
import DynamicDataTable from "./DataTable";
import { useStateContext } from "../../contexts/ContextProvider";
import Cookies from "js-cookie";
import NoDataFound from "../../NoDataFound";
import { Button, FormControlLabel } from "@mui/material";
import useCustomQuery from "../../useCustomQuery";
import Loading from "../../Loading";
import SomthingwentWrong from "../../SomthingwentWrong";
import BulkAdmission from "./BulkAdmission";

function Create_Registration_Form() {
  const label = { inputProps: { 'aria-label': 'Size switch demo' } };

  const { currentColor } = useStateContext();
  const authToken = Cookies.get("token");
  const [sibling,setsibling]=useState(true)
  const [loading, setLoading] = useState(false);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [submittedData, setSubmittedData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [getClass, setGetClass] = useState({});
  const [selectedClass, setSelectedClass] = useState("");
  const [availableSections, setAvailableSections] = useState([]);
  const [studentImagePreview, setStudentImagePreview] = useState(null);
  const [parentImagePreview, setParentImagePreview] = useState(null);

  const handleImagePreview = (e, setImagePreview) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const {
    queryData: allAdmission,
    loading: admissionLoading,
    error: admissionError,
    refetch: refetchRegistrations,
  } = useCustomQuery(
    "https://eshikshaserver.onrender.com/api/v1/adminRoute/getLastYearStudents"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://eshikshaserver.onrender.com/api/v1/adminRoute/createStudentParent",
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Form submitted successfully:", response.data);
      setIsOpen(!isOpen);
      refetchRegistrations();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClassChange = (e) => {
    const selectedClassName = e.target.value;
    setSelectedClass(selectedClassName);
    const selectedClassObj = getClass.find(
      (cls) => cls.className === selectedClassName
    );

    if (selectedClassObj) {
      setAvailableSections(selectedClassObj.sections.split(", "));
    } else {
      setAvailableSections([]);
    }
  };
  useEffect(() => {
    axios
      .get(
        `https://eshikshaserver.onrender.com/api/v1/adminRoute/getAllClasses`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        let classes = response.data.classList;

        setGetClass(classes.sort((a, b) => a - b));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const handleDelete = (email) => {
    const authToken = Cookies.get("token");

    const ConfirmToast = ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete this student?</p>
        <button
          className="text-red-700 font-bold text-xl"
          onClick={() => {
            axios
              .put(
                `https://eshikshaserver.onrender.com/api/v1/adminRoute/deactivateStudent`,
                { email },
                {
                  withCredentials: true,
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                }
              )
              .then((response) => {
                const updatedData = submittedData.filter(
                  (item) => item.email !== email
                );
                setSubmittedData(updatedData);
                setShouldFetchData(!shouldFetchData);
                refetchRegistrations();
                toast.success("Student data deleted successfully");
                closeToast();
              })
              .catch((error) => {
                console.error("Error deleting Student data:", error);
                toast.error(
                  "An error occurred while deleting the Student data."
                );
                closeToast();
              });
          }}
          style={{ marginRight: "10px" }}
        >
          Yes
        </button>
        <button onClick={closeToast} className="text-green-800 text-xl">
          No
        </button>
      </div>
    );

    toast(<ConfirmToast />);
  };

  useEffect(() => {
    if (allAdmission) {
      setSubmittedData(allAdmission.allStudent);
    }
  });

  if (admissionLoading) {
    return <Loading />;
  }
  if (admissionError) {
    return <SomthingwentWrong />;
  }
  return (
    <div className="md:h-screen mt-20 md:mt-1 p-3 ">
      <h1
        className="text-4xl font-bold mb-4 uppercase text-center  hover-text "
        style={{ color: currentColor }}
      >
        New Admission
      </h1>

      <div className=" mb-4">
        <Button
          variant="contained"
          style={{ backgroundColor: currentColor, marginRight: "20px" }}
          onClick={toggleModal}
        >
          Create Admission
        </Button>
        <BulkAdmission refreshRegistrations={refetchRegistrations} />
      </div>
      <div className=" mb-4"></div>
      {isOpen && (
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-[99999999] flex justify-center items-center w-full h-screen bg-gray-900 bg-opacity-50"
        >
          <div className="relative p-4 w-full  max-h-full" data-aos="fade-down">
            <div className="relative  rounded-lg shadow dark:bg-gray-700 overflow-auto ">
              <div className="flex items-center justify-between p-2 md:p-2 border-b rounded-t dark:border-gray-600 bg-white">
                <h3 className="text-xl font-semibold  dark:text-white">
                  Admission Form
                </h3>
                <button
                  onClick={toggleModal}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                      d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="h-[80vh] sm:h-[70vh] md:h-[70vh] lg:h-[70vh]  overflow-auto  bg-gray-50">
                <form
                  onSubmit={handleSubmit}
                  // className=" grid  md:grid-cols-4 grid-cols-1 gap-3 p-6  mx-auto bg-gray-100 rounded-md shadow-md"
                >
                  <div className=" grid  md:grid-cols-5 grid-cols-2 gap-3 p-6  mx-auto bg-gray-100 rounded-md shadow-md">
                    <div className="flex flex-col space-y-1">
                      {/* <label className="block text-[12px] font-medium text-gray-700">Full Name:</label> */}
                      <label className="block text-[12px] font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="studentFullName"
                        className="border border-gray-300 px-2 py-1  rounded"
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">Admission No :</label>
                      <input
                        type="text"
                        name="admissionNumber"
                        className="border border-gray-300 px-2 py-1  rounded"
                     
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">Email:</label>
                      <input
                        type="email"
                        name="studentEmail"
                        className="border border-gray-300 px-2 py-1  rounded"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">Password:</label>
                      <input
                        type="password"
                        name="studentPassword"
                        className="border border-gray-300 px-2 py-1  rounded"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">Date of Birth:</label>
                      <input
                        type="date"
                        name="studentDateOfBirth"
                        className="border border-gray-300 px-2 py-1  rounded"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">Gender:</label>
                      <select
                        name="studentGender"
                        className="border border-gray-300 px-2 py-1  rounded"
                        required
                      >
                        <option value="" disabled selected>
                          Select Gender
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">Joining Date:</label>
                      <input
                        type="date"
                        name="studentJoiningDate"
                        className="border border-gray-300 px-2 py-1  rounded"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">Contact:</label>
                      <input
                        type="tel"
                        name="studentContact"
                        className="border border-gray-300 px-2 py-1  rounded"
                        minLength="10"
                        maxLength="10"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">Class:</label>
                      <select
                        name="studentClass"
                        className="border border-gray-300 px-2 py-1  rounded"
                        value={selectedClass}
                        onChange={handleClassChange}
                        required
                      >
                        <option value="" disabled>
                          Select a Class
                        </option>
                        {getClass.map((cls, index) => (
                          <option key={index} value={cls.className}>
                            {cls?.className}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">Section:</label>
                      <select
                        name="studentSection"
                        className="border border-gray-300 px-2 py-1  rounded"
                        required
                      >
                        <option value="" disabled>
                          Select a Section
                        </option>
                        {availableSections.map((section, index) => (
                          <option key={index} value={section}>
                            {section}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">Address:</label>
                      <input
                        type="text"
                        name="studentAddress"
                        className="border border-gray-300 px-2 py-1  rounded"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">Country:</label>
                      <input
                        type="text"
                        name="studentCountry"
                        className="border border-gray-300 px-2 py-1  rounded"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">City:</label>
                      <input
                        type="text"
                        name="city"
                        className="border border-gray-300 px-2 py-1  rounded"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">State:</label>
                      <input
                        type="text"
                        name="state"
                        className="border border-gray-300 px-2 py-1  rounded"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">Pincode:</label>
                      <input
                        type="text"
                        name="pincode"
                        className="border border-gray-300 px-2 py-1  rounded"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">Nationality:</label>
                      <input
                        type="text"
                        name="nationality"
                        className="border border-gray-300 px-2 py-1  rounded"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">Caste:</label>
                      <input
                        type="text"
                        name="caste"
                        className="border border-gray-300 px-2 py-1  rounded"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">Religion:</label>
                      <input
                        type="text"
                        name="religion"
                        className="border border-gray-300 px-2 py-1  rounded"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="block text-[12px] font-medium text-gray-700">Student Image:</label>
                      <input
                        type="file"
                        name="studentImage"
                        className="border border-gray-300 px-2 py-1  rounded"
                        accept="image/*"
                        onChange={(e) =>
                          handleImagePreview(e, setStudentImagePreview)
                        }
                      />
                      {studentImagePreview && (
                        <img
                          src={studentImagePreview}
                          alt="Student Preview"
                          className="mt-2 w-32 h-32 object-cover rounded"
                          required
                        />
                      )}
                    </div>
                  </div>
                <div className="flex flex-row gap-10  justify-center bg-gray-100 py-2  text-center">
                <span className=" text-xl text-blue-900">
                    Parent Details
                  </span>
                  <FormControlLabel
          control={
            <Switch  onClick={()=>setsibling(!sibling)} />
          }
          label="Sibling"
        />
                </div>
                  {/* <Switch  label="Jason Killian" defaultChecked onClick={()=>setsibling(!sibling)} value="start" /> */}
                  {
                    sibling ? (
                    
                    <div 
                    className=" grid  md:grid-cols-4 grid-cols-1 gap-3 p-6  mx-auto bg-gray-100 rounded-md shadow-md"
                    >
                      <div className="flex flex-col space-y-1">
                        <label className="block text-[12px] font-medium text-gray-700">Father's Name:</label>
                        <input
                          type="text"
                          name="fatherName"
                          className="border border-gray-300 px-2 py-1  rounded"
                          required
                        />
                      </div>
  
                      <div className="flex flex-col space-y-1">
                        <label className="block text-[12px] font-medium text-gray-700">Mother's Name:</label>
                        <input
                          type="text"
                          name="motherName"
                          className="border border-gray-300 px-2 py-1  rounded"
                        />
                      </div>
  
                      <div className="flex flex-col space-y-1">
                        <label className="block text-[12px] font-medium text-gray-700">Parent Email:</label>
                        <input
                          type="email"
                          name="parentEmail"
                          className="border border-gray-300 px-2 py-1  rounded"
                          required
                        />
                      </div>
  
                      <div className="flex flex-col space-y-1">
                        <label className="block text-[12px] font-medium text-gray-700">Parent Password:</label>
                        <input
                          type="password"
                          name="parentPassword"
                          className="border border-gray-300 px-2 py-1  rounded"
                          required
                        />
                      </div>
  
                      <div className="flex flex-col space-y-1">
                        <label className="block text-[12px] font-medium text-gray-700">Parent Contact:</label>
                        <input
                          type="tel"
                          name="parentContact"
                          className="border border-gray-300 px-2 py-1  rounded"
                          minLength="10"
                          maxLength="10"
                          required
                        />
                      </div>
  
                      <div className="flex flex-col space-y-1">
                        <label className="block text-[12px] font-medium text-gray-700">Parent Income:</label>
                        <input
                          type="text"
                          name="parentIncome"
                          className="border border-gray-300 px-2 py-1  rounded"
                        />
                      </div>
  
                      <div className="flex flex-col space-y-1">
                        <label className="block text-[12px] font-medium text-gray-700">
                          Parent Qualification:
                        </label>
                        <input
                          type="text"
                          name="parentQualification"
                          className="border border-gray-300 px-2 py-1  rounded"
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="block text-[12px] font-medium text-gray-700">Parent Image:</label>
                        <input
                          type="file"
                          name="parentImage"
                          className="border border-gray-300 px-2 py-1  rounded"
                          required
                          accept="image/*"
                          onChange={(e) =>
                            handleImagePreview(e, setParentImagePreview)
                          }
                        />
                        {parentImagePreview && (
                          <img
                            src={parentImagePreview}
                            alt="Parent Preview"
                            className="mt-2 w-32 h-32 object-cover rounded"
                          />
                        )}
                      </div>
                    </div>):(
                      <div 
                       className="  gap-3 p-6  bg-gray-100 rounded-md shadow-md"
                      >
 <div className="flex flex-col md:max-w-[25%] w-full  ">
                        <label className="block text-[12px] font-medium text-gray-700">Parent's Admission Number:</label>
                        <input
                          type="text"
                          name="parentAdmissionNumber"
                          className="border border-gray-300 px-2 py-1  rounded"
                        />
                      </div>
                      </div>
                     )
                  }

                  <div className="md:col-span-6 text-right mt-3 ">
                    <div className="flex items-center gap-5 p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                      <Button
                        type="submit"
                        variant="contained"
                        style={{
                          backgroundColor: currentColor,
                          color: "white",
                          width: "100%",
                        }}
                      >
                        {loading ? (
                          <svg
                            aria-hidden="true"
                            className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        ) : (
                          " Submit"
                        )}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={toggleModal}
                        style={{
                          backgroundColor: "#616161",
                          color: "white",
                          width: "100%",
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        // </div>
      )}

      <div className=" items-center mt-5"></div>
      {submittedData.length > 0 ? (
        <DynamicDataTable data={submittedData} handleDelete={handleDelete} />
      ) : (
        <NoDataFound />
      )}
    </div>
  );
}

export default Create_Registration_Form;

// import React, { useState, useEffect } from "react";
// import InputForm from "../../Dynamic/Form/InputForm";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./index.css";
// import axios from "axios";
// import "../../Dynamic/Form/FormStyle.css";
// import DynamicDataTable from "./DataTable";
// import { useStateContext } from "../../contexts/ContextProvider";
// import Cookies from "js-cookie";
// import ErrorPage from "../../ErrorPage";
// import { Button } from "@mui/material";
// import useCustomQuery from "../../useCustomQuery";
// import Loading from "../../Loading";
// import SomthingwentWrong from "../../SomthingwentWrong";
// import BulkAdmission from "./BulkAdmission";

// function Create_Registration_Form() {
//   const { currentColor } = useStateContext();
//   const authToken = Cookies.get("token");
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
// studentFullName: "Anand Kumar Jaiswal",
// studentEmail: "@gmail.com",
// studentPassword: "12345",
// studentDateOfBirth: "",
// studentRollNo: "2",
// studentGender: "male",
// studentJoiningDate: "",
// studentAddress: "Santimarg west vinod nagar",
// studentContact: "7079771102",
// studentClass: "3",
// studentSection: "A",
// studentCountry: "India",
// studentSubject: "Hindi",
// fatherName: "RajKumar",
// motherName: "Mother",
// parentEmail: "@gmail.com",
// parentPassword: "12345",
// parentContact: "7079771102",
// parentIncome: "300000",
// parentQualification: "BA",
// city: "Laxmi nagar",
// state: "Delhi",
// pincode: "110092",
// nationality: "india",
// caste: "Jaiswal",
// religion: "Hindi",
// studentImage: "",
// parentImage: "",
//   });

//   const [shouldFetchData, setShouldFetchData] = useState(false);
//   const [submittedData, setSubmittedData] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const toggleModal = () => {
//     setIsOpen(!isOpen);
//   };

//   const {
//     queryData: allAdmission,
//     loading: admissionLoading,
//     error: admissionError,
//     refetch: refetchRegistrations,
//   } = useCustomQuery(
//     "https://eshikshaserver.onrender.com/api/v1/adminRoute/getLastYearStudents"
//   );
//   const handleFieldChange = (fieldName, value) => {
//     setFormData({
//       ...formData,
//       [fieldName]: value,
//     });
//   };

//   const handleImageChange = (e) => {
//     const name = e.target.name;
//     const file = e.target.files[0];

//     setFormData({
//       ...formData,
//       [name]: file,
//     });
//   };

//   const handleSubmit = async () => {
//     const formDataToSend = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       if (key !== "studentImage" && key !== "parentImage") {
//         formDataToSend.append(key, String(value));
//       }
//     });

//     formDataToSend.append("studentImage", formData.studentImage);
//     formDataToSend.append("parentImage", formData.parentImage);

//     try {
//       setLoading(true);
// await axios.post(
//   "https://eshikshaserver.onrender.com/api/v1/adminRoute/createStudentParent",
//   formDataToSend,
//   {
//     withCredentials: true,
//     headers: {
//       Authorization: `Bearer ${authToken}`,
//       "Content-Type": "multipart/form-data",
//     },
//   }
// );

//       setFormData({
//         studentFullName: "",
//         studentEmail: "",
//         studentPassword: "",
//         studentDateOfBirth: "",
//         // studentRollNo: "",
//         studentGender: "",
//         studentJoiningDate: "",
//         studentAddress: "",
//         studentContact: "",
//         studentClass: "",
//         studentSection: "",
//         studentCountry: "",
//         // studentSubject: "",
//         fatherName: "",
//         motherName: "",
//         parentEmail: "",
//         parentPassword: "",
//         parentIncome: "",
//         parentQualification: "",
//         parentContact: "",
//         studentImage: null,
//         parentImage: null,
//       });
//       setSubmittedData([...submittedData, formData]);
//       setLoading(false);
//       refetchRegistrations();
//       toast.success("Form submitted successfully!");
//       setShouldFetchData(!shouldFetchData);
//       setIsOpen(false);
//     } catch (error) {
//       toast.error("An error occurred while submitting the form.", error);
//       setLoading(false);
//     }
//   };

//   const handleDelete = (email) => {
//     const authToken = Cookies.get("token");

//     const ConfirmToast = ({ closeToast }) => (
//       <div>
//         <p>Are you sure you want to delete this student?</p>
//         <button
//           className="text-red-700 font-bold text-xl"
//           onClick={() => {

//             axios
//               .put(
//                 `https://eshikshaserver.onrender.com/api/v1/adminRoute/deactivateStudent`,
//                 { email },
//                 {
//                   withCredentials: true,
//                   headers: {
//                     Authorization: `Bearer ${authToken}`,
//                   },
//                 }
//               )
//               .then((response) => {
//                 const updatedData = submittedData.filter(
//                   (item) => item.email !== email
//                 );
//                 setSubmittedData(updatedData);
//                 setShouldFetchData(!shouldFetchData);
//                 refetchRegistrations()
//                 toast.success("Student data deleted successfully");
//                 closeToast();
//               })
//               .catch((error) => {
//                 console.error("Error deleting Student data:", error);
//                 toast.error(
//                   "An error occurred while deleting the Student data."
//                 );
//                 closeToast();
//               });
//           }}
//           style={{ marginRight: "10px" }}
//         >
//           Yes
//         </button>
//         <button onClick={closeToast} className="text-green-800 text-xl">
//           No
//         </button>
//       </div>
//     );

//     toast(<ConfirmToast />);
//   };

//   const formFields = [
//     {
//       label: "Full Name",
//       name: "studentFullName",
//       type: "text",
//       value: formData.studentFullName,
//     },
//     {
//       label: "Email",
//       name: "studentEmail",
//       type: "email",
//       value: formData.studentEmail,
//     },
//     {
//       label: "Password",
//       name: "studentPassword",
//       type: "password",
//       value: formData.studentPassword,
//     },
//     {
//       label: "Date of Birth",
//       name: "studentDateOfBirth",
//       type: "date",
//       value: formData.studentDateOfBirth,
//     },

//     {
//       label: "Parent Income",
//       name: "parentIncome",
//       type: "text",
//       value: formData.parentIncome,
//     },
//     {
//       label: "Parent Qualification",
//       name: "parentQualification",
//       type: "text",
//       value: formData.parentQualification,
//     },
//     {
//       label: "Gender",
//       name: "studentGender",
//       type: "select",
//       value: formData.studentGender,

//       selectOptions: ["Gender", "Male", "Female", "Other"],
//     },
//     {
//       label: "Admission Date",
//       name: "studentJoiningDate",
//       type: "date",
//       value: formData.studentJoiningDate,
//     },
//     {
//       label: "Address",
//       name: "studentAddress",
//       type: "text",
//       value: formData.studentAddress,
//     },
//     {
//       label: "City",
//       name: "city",
//       type: "text",
//       value: formData.city,
//     },
//     {
//       label: "State",
//       name: "state",
//       type: "text",
//       value: formData.state,
//     },
//     {
//       label: "Pincode",
//       name: "pincode",
//       type: "text",
//       value: formData.pincode,
//     },
//     {
//       label: "Contact",
//       name: "studentContact",
//       type: "tel",
//       value: formData.studentContact,
//     },
//     {
//       label: "Religion",
//       name: "religion",
//       type: "text",
//       value: formData.religion,
//     },
//     {
//       label: "Caste",
//       name: "caste",
//       type: "text",
//       value: formData.caste,
//     },
//     {
//       label: "Nationality",
//       name: "nationality",
//       type: "text",
//       value: formData.nationality,
//     },
//     {
//       label: "Class Of Student",
//       name: "studentClass",
//       type: "select",
//       value: formData.studentClass,

//       selectOptions: [
//         "Class",
//         "NURSERY",
//         "LKG",
//         "UKG",
//         "1",
//         "2",
//         "3",
//         "4",
//         "5",
//         "6",
//         "7",
//         "8",
//         "9",
//         "10",
//         "11",
//         "12",
//       ],
//     },
//     {
//       label: "Section",
//       name: "studentSection",
//       type: "select",
//       value: formData.studentSection,

//       selectOptions: ["Section", "A", "B", "C", "D", "E"],
//     },
//     {
//       label: "Country",
//       name: "studentCountry",
//       type: "text",
//       value: formData.studentCountry,
//     },
//     // {
//     //   label: "Subject",
//     //   name: "studentSubject",
//     //   type: "text",
//     //   value: formData.studentSubject,

//     // },
//     {
//       label: "Father's Name",
//       name: "fatherName",
//       type: "text",
//       value: formData.fatherName,
//     },
//     {
//       label: "Mother's Name",
//       name: "motherName",
//       type: "text",
//       value: formData.motherName,
//     },
//     {
//       label: "Parent Email",
//       name: "parentEmail",
//       type: "email",
//       value: formData.parentEmail,
//     },
//     {
//       label: "Parent Password",
//       name: "parentPassword",
//       type: "password",
//       value: formData.parentPassword,
//     },
//     {
//       label: "Parent Contact",
//       name: "parentContact",
//       type: "tel",
//       value: formData.parentContact,
//     },
//     {
//       label: "Student Pic",
//       name: "studentImage",
//       type: "file",
//       accept: "image/*",
//     },
//     {
//       label: "Parent Pic",
//       name: "parentImage",
//       type: "file",
//       accept: "image/*",
//     },
//   ];

//   useEffect(() => {
//     if (allAdmission) {
//       setSubmittedData(allAdmission.allStudent);
//     }
//   });

//   if (admissionLoading) {
//     return <Loading />;
//   }
//   if (admissionError) {
//     return <SomthingwentWrong />;
//   }
//   return (
//     <div className=" mt-20 md:mt-1 p-3 ">
//       <h1
//         className="text-4xl font-bold mb-4 uppercase text-center  hover-text "
//         style={{ color: currentColor }}
//       >
//         New Admission
//       </h1>

//       <div className=" mb-4">
//         <Button
//           variant="contained"
//           style={{ backgroundColor: currentColor,marginRight:"20px" }}
//           onClick={toggleModal}
//         >
//           Create Admission
//         </Button>
//         <BulkAdmission refreshRegistrations={refetchRegistrations}/>
//       </div>
//       <div className=" mb-4">

//       </div>
//       {isOpen && (
//         <div
//           id="default-modal"
//           tabIndex="-1"
//           aria-hidden="true"
//           className="fixed top-0 right-0 left-0 z-[99999999] flex justify-center items-center w-full h-screen bg-gray-900 bg-opacity-50"

//         >
//           <div className="relative p-4 w-full  max-h-full"
//             data-aos="fade-down"
//           >
//             <div className="relative  rounded-lg shadow dark:bg-gray-700 overflow-auto ">
//               <div className="flex items-center justify-between p-2 md:p-2 border-b rounded-t dark:border-gray-600 bg-white">
//                 <h3 className="text-xl font-semibold  dark:text-white">
//                  Admission Form
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
//               <div className="h-[80vh] sm:h-[70vh] md:h-[70vh] lg:h-[70vh]  overflow-auto  bg-gray-50">
//               {/* <div className="h-[80vh] md:h-auto overflow-auto  bg-yellow-400"> */}
//                 <div className="p-4 md:p-5 space-y-4  ">
//                   <InputForm
//                     fields={formFields}
//                     handleChange={handleFieldChange}
//                     handleImageChange={handleImageChange}
//                   />

//                   <div className="md:col-span-6 text-right mt-3 ">
//                     <div className="flex items-center gap-5 p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
//                       <Button
//                         type="submit"
//                         variant="contained"
//                         onClick={handleSubmit}
//                         style={{
//                           backgroundColor: currentColor,
//                           color: "white",
//                           width: "100%",
//                         }}
//                       >
//                         {loading ? (
//                           <svg
//                             aria-hidden="true"
//                             className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
//                             viewBox="0 0 100 101"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <path
//                               d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
//                               fill="currentColor"
//                             />
//                             <path
//                               d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
//                               fill="currentFill"
//                             />
//                           </svg>
//                         ) : (
//                           " Submit"
//                         )}
//                       </Button>
//                       <Button
//                         variant="contained"
//                         onClick={toggleModal}
//                         style={{
//                           backgroundColor: "#616161",
//                           color: "white",
//                           width: "100%",
//                         }}
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className=" items-center mt-5"></div>
//       {submittedData.length > 0 ? (
//         <DynamicDataTable data={submittedData} handleDelete={handleDelete} />
//       ) : (
//         <ErrorPage />
//       )}
//     </div>
//   );
// }

// export default Create_Registration_Form;
