import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useStateContext } from "../../../contexts/ContextProvider";

function DynamicDataTable({ data, handleDelete }) {
  const { currentColor } = useStateContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);

  const handleDeleteClick = (itemId) => {
    setDeletingItemId(itemId);
    setDeleteDialogOpen(true);
  };
  const handleConfirmDelete = () => {
    handleDelete(deletingItemId);
    setDeleteDialogOpen(false);
    setDeletingItemId(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeletingItemId(null);
  };

  const columns = [
    {
      field: "id",
      headerName: "S. No.",
      minWidth: 50,flex:1,
      renderCell: (params) => (
        <span style={{ color: "#01579b", fontSize: "12px" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "image.url",
      headerName: "Photo",
      minWidth: 80,flex:1,
      // flex:1,

      renderCell: (params) => (
        
          <img
          src={params.row.image?.url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'}
          // src={params.row.image?.url}
          alt="Student"
          style={{ width: "40px", height: "40px", borderRadius: "50%",objectFit: "cover",  }}
        />
       
      ),
    },
    {
      field: "admissionNumber",
      headerName: "Admission No.",
      minWidth: 100,flex:1,
      renderCell: (params) => (
        <span style={{ color: "#ff6d00", fontSize: "12px" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "fullName",
      headerName: "Student Name",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span style={{ color: "#01579b", fontSize: "12px" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "class",
      headerName: "Class",
      minWidth: 80,flex:1,
      renderCell: (params) => (
        <span style={{ fontSize: "12px", color: "#01579b", }}>
          {`${params.row.class} - ${params.row.section}`}
        </span>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span style={{ color: "#ff3d00", fontSize: "12px" }}>
          {params.value}
        </span>
      ),
    },
    
    {
      field: "contact",
      headerName: "Contact",
      minWidth: 110,flex:1,
      renderCell: (params) => (
        <span style={{ color: "#e65100", fontSize: "12px" }}>
          {params.value}
        </span>
      ),
    },
    // { field: "class", headerName: "Class", flex: 1 },
    // { field: "section", headerName: "Section", flex: 1 },
   
    // {
    //   field: "rollNo",
    //   headerName: "Roll No",
    //   minWidth:70,flex:1,
    //   renderCell: (params) => (
    //     <span style={{ color: "#01579b", fontSize: "12px" }}>
    //       {params.value}
    //     </span>
    //   ),
    // },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 200,flex:1,
      //  flex :1,
      renderCell: (params) => (
        <div className="">
          <Link
            to={`/admin/allstudent/viewstudent/view-profile/${params.row.admissionNumber}`}
            // to={`/admin/allstudent/viewstudent/view-profile/${params.row.email}`}
          >
            <IconButton>
              <VisibilityIcon
                style={{ color: currentColor, fontSize: "16px" }}
              />
            </IconButton>
          </Link>

          <Link
            to={`/admin/allstudent/editstudent/edit-profile/${params.row.email}`}
            className=""
          >
            <IconButton>
              <EditIcon
                className="text-green-600 "
                style={{ fontSize: "16px" }}
              />
            </IconButton>
          </Link>
          <IconButton onClick={() => handleDeleteClick(params.row.email)}>
            <DeleteIcon className="text-red-600" style={{ fontSize: "16px" }} />
          </IconButton>
          {/* <Link to={`/admin/allstudent/StudentFeeStatus/${params.row.email}`}>
            <Button
              variant="contained"
              style={{
                backgroundColor: currentColor,
                color: "white",
                fontSize: "10px",
              }}
            >
              Fee status
            </Button>
          </Link> */}
        </div>
      ),
    },
  ];

  const dataWithIds = Array.isArray(data)
    ? data.map((item, index) => ({ id: index + 1, ...item })).reverse()
    : [];

  return (
    <div>
      <div className="max-h-screen dark:text-white dark:bg-secondary-dark-bg mx-auto bg-white mt-2 rounded-md overflow-auto w-full">
        <DataGrid
          rows={dataWithIds}
          columns={columns}
          className="dark:text-white dark:bg-secondary-dark-bg  mx-auto bg-white"
        />
      </div>
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DynamicDataTable;

// import React, { useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { Link } from "react-router-dom";
// import IconButton from "@mui/material/IconButton";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// import Button from "@mui/material/Button";
// import { useStateContext } from "../../../contexts/ContextProvider";

// function DynamicDataTable({ data, handleDelete }) {
//   const { currentColor } = useStateContext();
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [deletingItemId, setDeletingItemId] = useState(null);

//   const handleDeleteClick = (itemId) => {
//     setDeletingItemId(itemId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     handleDelete(deletingItemId);
//     setDeleteDialogOpen(false);
//     setDeletingItemId(null);
//   };

//   const handleCancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setDeletingItemId(null);
//   };

//   const columns = [
//     { field: "id", headerName: "S. No.", minWidth: 50 },
//     { field: "image.url", headerName: "Photo.", minWidth: 50 },
//     { field: "fullName", headerName: "Student Name", flex: 1 },
//     { field: "email", headerName: "Email", flex: 1 },
//     { field: "rollNo", headerName: "Roll No", flex: 1 },
//     { field: "contact", headerName: "Contact", flex: 1 },
//     { field: "class", headerName: "Class", flex: 1 },
//     { field: "section", headerName: "Section", flex: 1 },

//     {
//       field: "actions",
//       headerName: "Actions",
//       minWidth: 300,
//       renderCell: (params) => (
//         <div>
//           <Link
//             to={`/admin/allstudent/viewstudent/view-profile/${params.row.email}`}
//           >
//             <IconButton>
//               <VisibilityIcon style={{ color: currentColor }} />
//             </IconButton>
//           </Link>

//           <Link
//             to={`/admin/allstudent/editstudent/edit-profile/${params.row.email}`}
//           >
//             <IconButton>
//               <EditIcon className="text-green-600" />
//             </IconButton>
//           </Link>
//           <IconButton onClick={() => handleDeleteClick(params.row.email)}>
//             <DeleteIcon className="text-red-600" />
//           </IconButton>
//           <Link to={`/admin/allstudent/StudentFeeStatus/${params.row.email}`}>
//             <IconButton>
//               <p

//                 className="text-[16px] text-gray-100 px-2 py-2 rounded-xl "
//                 style={{
//                   border: `2px solid ${currentColor} `,
//                   color: currentColor,
//                 }}
//               >
//                 Fee status
//               </p>
//             </IconButton>
//           </Link>
//         </div>
//       ),
//     },
//   ];

//   const dataWithIds = Array.isArray(data)
//     ? data.map((item, index) => ({ id: index + 1, ...item }))
//     : [];

//   return (
//     <div>
//       <div style={{ height: 550, minWidth: "100%" }}>
//         <DataGrid
//           rows={dataWithIds}
//           columns={columns}
//           className="dark:text-white dark:bg-secondary-dark-bg  mx-auto bg-white"
//         />
//       </div>
//       <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Do you really want to delete this item?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCancelDelete} color="primary">
//             No
//           </Button>
//           <Button onClick={handleConfirmDelete} color="primary">
//             Yes
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

// export default DynamicDataTable;
