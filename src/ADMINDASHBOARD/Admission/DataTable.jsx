import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import React, { useRef } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";


function DynamicDataTable({ data, handleDelete }) {
  const navigate = useNavigate();
  const { currentColor } = useStateContext();
  const componentPDF = useRef();
  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Admission List",
    onAfterPrint: () => toast.success("Download Successfully"),
  });

  const columns = [
    { 
      field: "id", 
      headerName: "S. No.", 
      minWidth: 50, 
      flex: 1, 
      renderCell: (params) => (
        <span style={{ color: "#1a237e", fontSize: "14px" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "image.url",
      headerName: "Photo",
      minWidth: 80,
      flex: 1,
      renderCell: (params) => (
        params.row.image && params.row.image.url ? (
          <img
            src={params.row.image?.url  }
            alt="Student"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <span><img className="h-10 w-10 rounded-full object-contain" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png" alt="" /></span>
        )
      ),
    },
    {
      field: "admissionNumber",
      headerName: "Admission No.",
      minWidth: 90,
      flex: 1,
      renderCell: (params) => (
        <span style={{ fontSize: "14px", color: "#ff6d00", }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "fullName",
      headerName: "Student Name",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <span style={{ color: "#01579b", fontSize: "14px" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "gender",
      headerName: "Gender",
      minWidth: 80,
      flex: 1,
      renderCell: (params) => (
        <span
          style={{
            color: params.value === "Female" ? "#e91e63" : "#135e83",
            fontSize: "14px",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => (
        <span style={{ fontSize: "14px", color: "#1a237e" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "contact",
      headerName: "Contact",
      minWidth: 110,
      flex: 1,
      renderCell: (params) => (
        <span style={{ fontSize: "14px", color: "#e65100" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Admission Date",
      minWidth: 130,
      flex: 1,
      // renderHeader: (params) => (
      //   <span style={{ fontSize: "14px", fontWeight: "700", }}>
      //     {params.colDef.headerName}
      //   </span>
      // ),
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return (
          <span style={{ fontSize: "14px", color: "#f50057" }}>
            {formattedDate}
          </span>
        );
      },
    },
    {
      field: "class",
      headerName: "Class",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <span style={{ fontSize: "14px", color: "#1a237e" }}>
          {`${params.row.class} - ${params.row.section}`}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <div>
          <Link to={`/admin/admission/view-admission/${params.row.admissionNumber}`}>
            <IconButton>
              <VisibilityIcon style={{ color: currentColor }} />
            </IconButton>
          </Link>
          <Link to={`/admin/admission/edit-admission/${params.row.email}`}>
            <IconButton>
              <EditIcon style={{ color: "#10b981" }} />
            </IconButton>
          </Link>
          <IconButton onClick={() => handleDelete(params.row.email)}>
            <DeleteIcon style={{ color: "#ef4444" }} />
          </IconButton>
        </div>
      ),
    },
  ];
  
  const dataWithIds = Array.isArray(data)
    ? data.map((item, index) => ({ id: index + 1, ...item })).reverse()
    : [];
  
  return (
    <div className="relative w-full">
      <div className="absolute right-0 -top-[52px]">
        <Button
          variant="contained"
          style={{ backgroundColor: currentColor, color: "white" }}
          onClick={generatePDF}
        >
          Download PDF
        </Button>
      </div>
      <DataGrid
        className="max-h-screen dark:text-white dark:bg-secondary-dark-bg mx-auto bg-white rounded-md overflow-auto w-full"
        rows={dataWithIds}
        columns={columns}
        ref={componentPDF}
      />
    </div>
  );
}

export default DynamicDataTable;


