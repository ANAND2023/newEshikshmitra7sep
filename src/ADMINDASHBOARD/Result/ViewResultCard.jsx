import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
// import school from '../../ShikshMitraWebsite/assets/student.png';
import axios from "axios";
import { usePDF } from "react-to-pdf";
import { useStateContext } from "../../contexts/ContextProvider";
import { Page, Text, View, doc } from "@react-pdf/renderer";
import Cookies from "js-cookie";
const authToken = Cookies.get("token");

const theader = {
  subject: "Subject",
  marks: "Marks",
  // day: "Day",
};

const ViewResultCard = () => {
  const { currentColor } = useStateContext();
  const { toPDF, targetRef } = usePDF({ filename: "Student Admit Card" });
  const { email } = useParams();

  const [studentData, setStudentData] = useState({});

 

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
      })
      .catch((error) => {
        console.error("Error fetching Student data:", error);
      });
  }, [email]);
  const userId = studentData._id;
  const [selectedExam, setSelectedExam] = useState("");
  const [examData, setExamData] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [studentMarks, setStudentMarks] = useState({});
  const [maximumMarks, setMaximumMarks] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [totalMarks, setTotalMarks] = useState("");

  const [schoolData, setSchoolData] = useState([]);
console.log("first",maximumMarks)
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
        const data = response.data.admin;

        setSchoolData(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://eshikshaserver.onrender.com/api/v1/exam/getAllExams", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        const examData = response.data.examData;
        setExamData(examData);

        const maxMarks = {};
        const examSubjects = [];

        if (examData) {
          examData.forEach((exam) => {
            if (exam.examInfo) {
              exam.examInfo.forEach((item) => {
                maxMarks[item._id] = item.subjectTotalMarks;
                examSubjects.push(item.subjectName);
              });
            }
          });
        }

        setMaximumMarks(maxMarks);
        setSubjects(examSubjects);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [selectedExam]);

  const handleExamChange = (e) => {
    setSelectedExam(e.target.value);
  };

  useEffect(() => {
    if (selectedExam && userId) {
      {
        console.log("first", selectedExam && userId);
      }
      axios
        .get(
          `https://eshikshaserver.onrender.com/api/v1/results/getResults?examName=${selectedExam}&studentId=${userId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((response) => {
          const data = response.data.data;

          setResultData(data);

          const newStudentMarks = {};
          response.data.data.forEach((result) => {
            newStudentMarks[result.studentId] = {};
            result.subjects.forEach((subject) => {
              newStudentMarks[result.studentId][subject.subjectName] =
                subject.marks;
            });
          });
          setStudentMarks(newStudentMarks);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [selectedExam, userId]);

  const calculateTotalMarksForStudent = (studentId) => {
    if (selectedExam) {
      const exam = examData.find((exam) => exam.examName === selectedExam);
      if (exam) {
        let total = 0;
        exam.examInfo.forEach((item) => {
          total = item.subjectTotalMarks;
        });
        const subjectsCount = exam.examInfo.length;
        return `${total} * ${subjectsCount} = ${total * subjectsCount}`;
      }
    }
    return 0;
  };

  const calculateMaximumMarksForStudent = () => {
    let totalMaxMarks = 0;
    if (maximumMarks) {
      Object.values(maximumMarks).forEach((subjectTotalMarks) => {
        totalMaxMarks += subjectTotalMarks;
      });
    }

    return totalMaxMarks;
  };

  const calculateMarksStudent = (studentId) => {
    if (!selectedExam) {
      return 0;
    }

    const studentMarkData = studentMarks[studentId];
    if (!studentMarkData) {
      return 0;
    }

    const filteredSubjects = subjects.filter((subject) => {
      const selectedExamData = examData.find(
        (exam) => exam.examName === selectedExam
      );
      return selectedExamData?.examInfo.some(
        (info) => info.subjectName === subject
      );
    });

    const totalMarks = filteredSubjects.reduce((acc, subject) => {
      return acc + (studentMarkData[subject] || 0);
    }, 0);

    return totalMarks;
  };

  const calculatePercentageForStudent = (studentId) => {
    if (!selectedExam) {
      return 0;
    }

    const studentMarkData = studentMarks[studentId];
    if (!studentMarkData) {
      return 0;
    }

    const totalMarks = Object.values(studentMarkData).reduce(
      (acc, subjectMark) => {
        return acc + (subjectMark || 0);
      },
      0
    );

    const totalMaxMarks = calculateMaximumMarksForStudent();
    const percentage = ((totalMarks / totalMaxMarks) * 100).toFixed(2);
    return `${percentage}%`;
  };

  const calculateSumOfSubjectTotalMarks = () => {
    if (selectedExam) {
      const exam = examData.find((exam) => exam.examName === selectedExam);
      if (exam) {
        let total = 0;
        exam.examInfo.forEach((item) => {
          const subjectMarks = studentMarks[item._id];
          if (subjectMarks) {
            total += subjectMarks[item.subjectName] || 0;
          }
        });
        return total;
      }
    }
    return 0;
  };

  const handleDownload = () => {
    toPDF();
    document.getElementById("studentResults");
  };

  return (
    <>
      <div className=" w-full   flex items-center justify-center pt-10 ">
        <div className="   gap-2 sm:p-4 md:p-4 lg:p-4 p-2 pt-16  shadow-[rgba(0,0,_0,_0.25)_0px_25px_50px-12px]   overflow-y-auto">
          <div className="mt-12 ">
            <select
              className="p-2 mb-2 border rounded-md w-full"
              onChange={handleExamChange}
              value={selectedExam}
            >
              <option value="">Select Exam</option>
              {examData.map((exam) => (
                <option key={exam._id} value={exam.examName}>
                  {exam.examName}
                </option>
              ))}
            </select>

            <button
              onClick={handleDownload}
              className="dark:text-white dark:bg-secondary-dark-bg text-gray-800  neu-btn border-2 "
              style={{
                border: `2px solid ${currentColor} `,
                color: currentColor,
              }}
            >
              Download
            </button>
          </div>
          <div ref={targetRef}>
            <Page size="A4">
              <View
                style={{
                  textAlign: "center",
                  marginLeft: 30,
                  marginRight: 30,
                  height: 150,
                  width: 150,
                }}
              >
                <div className="p-4 border border-gray-300 rounded-lg max-w-xl mx-auto bg-white shadow-md">
                  <div className="text-center">
                    <h1 className="text-3xl font-semibold mt-2">
                      {schoolData.schoolName}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {schoolData.address}
                    </p>
                  </div>
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-semibold">Report Card</h2>
                    <p>Exam: {selectedExam}</p>
                    <p>Academic Year: 2023-2024</p>
                  </div>
                  <div className="mt-8 flex flex-wrap justify-center items-center">
                    {studentData.image && (
                      <img
                        src={studentData.image.url}
                        alt="Student Photo"
                        className="w-24 h-24 mr-6"
                      />
                    )}
                    <div className="mt-4 w-full md:w-1/2 text-center md:text-left">
                      <p className="font-semibold">Student Details</p>
                      <p>Name: {studentData.fullName}</p>
                      <p>Class:{studentData.class} Grade</p>
                      <p>Section: {studentData.section}</p>
                      <p>Roll Number: {studentData.rollNo}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="font-semibold"></p>

                    <table className="w-full border border-gray-300 mt-5">
                      <thead className="bg-gray-100">
                        <tr>
                          {Object.keys(theader).map((key) => (
                            <th
                              key={key}
                              className="border border-gray-300 p-2"
                            >
                              {theader[key]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {resultData.map((item) => {
                          return item.subjects.map((data) => (
                            <tr key={data.subjectId}>
                              <td className="border border-gray-300 p-2">
                                {data.subjectName}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {data.marks}
                              </td>
                            </tr>
                          ));
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4">
                    {selectedExam ? (
                      <p className="font-semibold">
                        Percentage: {calculatePercentageForStudent(userId)}
                      </p>
                    ) : (
                      <p className="font-semibold">Percentage: </p>
                    )}

                    <p className="font-semibold">Grade: A</p>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">
                          Remarks: Excellent performance.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Principal's Signature</p>
                      </div>
                    </div>
                  </div>
                </div>
              </View>
            </Page>
{/*            
    <div className="max-w-4xl mx-auto p-4 bg-white border-2 border-black">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">Sunbeam School</h1>
        <p className="text-sm">Affiliated to CBSE New Delhi, Affiliation No.-2132475</p>
        <p className="text-sm">Bichee Tirnahi, Robertsganj , Sonebhadra , UP</p>
        <h2 className="text-lg font-bold mt-2">Progress Report</h2>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p><strong>Reg. no.</strong>: 846</p>
          <p><strong>Roll No.</strong>: 22</p>
          <p><strong>Student's Name</strong>: Samiyara Khatun</p>
          <p><strong>Class</strong>: 6 - B</p>
          <p><strong>Father's Name</strong>: Mr. Shabbir Khan</p>
          <p><strong>Date of Birth</strong>: 14-September-2008</p>
        </div>
        <div>
          <img src="/path/to/image.jpg" alt="Samiyara Khatun" className="w-24 h-24 border-2 border-black" />
        </div>
      </div>
      <table className="w-full border-collapse border border-black mb-4">
        <thead>
          <tr>
            <th className="border border-black p-1">Subject</th>
            <th className="border border-black p-1">Term-1 (100 Marks)</th>
            <th className="border border-black p-1">Grade</th>
            <th className="border border-black p-1">Term-2 (100 Marks)</th>
            <th className="border border-black p-1">Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-1">English</td>
            <td className="border border-black p-1">51.50</td>
            <td className="border border-black p-1">B</td>
            <td className="border border-black p-1">58.00</td>
            <td className="border border-black p-1">A</td>
          </tr>
          <tr>
            <td className="border border-black p-1">Hindi</td>
            <td className="border border-black p-1">28.00</td>
            <td className="border border-black p-1">E</td>
            <td className="border border-black p-1">43.00</td>
            <td className="border border-black p-1">D</td>
          </tr>
         
        </tbody>
      </table>
      <div className="mb-4">
        <p><strong>Total</strong>: 208.50</p>
        <p><strong>Total With Bonus</strong>: 208.50</p>
        <p><strong>Percentage</strong>: 26.06 %</p>
        <p><strong>Grand Total</strong>: 505.50</p>
        <p><strong>Grand Percentage</strong>: 31.59 %</p>
      </div>
      <div className="mb-4">
        <p><strong>Special Achievements</strong></p>
        <p>Samiyara Khatun has passed and is being promoted to class VII B</p>
      </div>
      <div className="flex justify-between">
        <div>
          <p><strong>Rank</strong>: 29</p>
          <p><strong>Position</strong>: 58</p>
          <p><strong>Attendance</strong>: 75.47 %</p>
        </div>
        <div>
          <p><strong>H.Y.</strong>: 28</p>
          <p><strong>ANNL.</strong>: 55</p>
          <p><strong>FINAL</strong>: 56</p>
        </div>
      </div>
      <div className="mt-4">
        <p><strong>Co-Scholastic-Term-I(on a 3 point (A-C) grading scale)</strong></p>
        <table className="w-full border-collapse border border-black">
          <thead>
            <tr>
              <th className="border border-black p-1">Activity</th>
              <th className="border border-black p-1">Term I Grade</th>
              <th className="border border-black p-1">Term II Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1">Work Education (L.T.A)</td>
              <td className="border border-black p-1">A</td>
              <td className="border border-black p-1">A</td>
            </tr>
            <tr>
              <td className="border border-black p-1">Art Education</td>
              <td className="border border-black p-1">A</td>
              <td className="border border-black p-1">A</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div> */}



          </div>
        </div>
      </div>
    </>
  );
};

export default ViewResultCard;
