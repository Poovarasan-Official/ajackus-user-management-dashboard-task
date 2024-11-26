import { useEffect, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import "./App.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ActionButton from "./components/ActionButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid2";
import { Formik, Form } from "formik";

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

// ===============|validation schema using Yup |================//
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

function App() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleClickOpen = (user = null) => {
    setOpen(true);
    if (user) {
      setIsEdit(true); // If there's a user, edit mode
      setCurrentUser(user);
    } else {
      setIsEdit(false); // Otherwise, add mode
      setCurrentUser(null); // Clear current user for add mode
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setCurrentUser(null);
  };

  // Initial form values
  const initialValues = {
    username: "",
    name: "",
    email: "",
  };

  // ===============| Handle form submission ADD & EDIT |================//
  const handleSubmit = async (values) => {
    try {
      if (!isEdit) {
        const response = await axios.post(
          "https://jsonplaceholder.typicode.com/users",
          values
        );
        alert("User successfully added!");
        console.log("Form data submitted:", response.data);
        setUsers([...users, response.data]);
      } else {
        const response = await axios.put(
          `https://jsonplaceholder.typicode.com/users/${currentUser.id}`,
          values
        );
        alert("User successfully updated!");
        console.log("Form data updated:", response.data);
        setUsers(
          users.map((user) =>
            user.id === currentUser.id ? response.data : user
          )
        );
      }
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // ===============| Fetch user list data |================//
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        setUsers(response.data); // Set the users data on successful fetch
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // ===============| Delete a user |================//
  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter((user) => user.id !== id)); // Remove user locally
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5">User Management Dashboard</Typography>
        <Grid container spacing={2}>
          <ActionButton
            text="Add User"
            color="primary"
            onClick={() => handleClickOpen()}
          />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 950 }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: "grey", fontSize: "50px" }}>
                <TableRow>
                  <TableCell>id</TableCell>
                  <TableCell>UserName</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell component="th" scope="row">
                      {user.id}
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <EditIcon
                          onClick={() => handleClickOpen(user)}
                          sx={{
                            color: "dark",
                            fontSize: 25,
                          }}
                        />
                        <DeleteForeverIcon
                          label
                          onClick={() => deleteUser(user.id)}
                          sx={{
                            color: "red",
                            fontSize: 25,
                          }}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ==============| Dialog Box ADD & EDIT |==============*/}
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {isEdit ? "Edit User" : "Add User"}
            </DialogTitle>
            <DialogContent>
              <Formik
                initialValues={
                  isEdit && currentUser ? currentUser : initialValues
                }
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <Form>
                    <TextField
                      margin="dense"
                      label="Username"
                      name="username"
                      type="text"
                      fullWidth
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                    />

                    <TextField
                      margin="dense"
                      label="Name"
                      name="name"
                      type="text"
                      fullWidth
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />
                    <TextField
                      margin="dense"
                      label="Email"
                      name="email"
                      type="email"
                      fullWidth
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                    <DialogActions>
                      <ActionButton
                        autoFocus
                        text="Cancel"
                        variant="outlined"
                        onClick={handleClose}
                      />
                      <ActionButton
                        type="submit"
                        autoFocus
                        text={isEdit ? "Save Changes" : "Add User"}
                        variant="contained"
                        onClick={handleSubmit}
                      />
                    </DialogActions>
                  </Form>
                )}
              </Formik>
            </DialogContent>
          </Dialog>
        </Grid>
      </Box>
    </>
  );
}

export default App;
