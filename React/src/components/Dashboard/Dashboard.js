import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import app from "../../config/firebase.js";
import { auth, db } from "../../config/firebase";
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { getDatabase, ref, onValue } from "firebase/database";
import Link from "@mui/material/Link";

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import EmergencyShareRoundedIcon from "@mui/icons-material/EmergencyShareRounded";
import DeleteIcon from "@mui/icons-material/Delete";

const realtimedb = getDatabase(app);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [firstload, setfirstload] = useState(true);
  let [newdataSingle, SetData] = useState("");
  let [newdata, SetDatas] = useState([]);
  const [changeCount, setChangeCount] = useState(0);
  const [counter, setcounter] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [emergencyData, setemergencyData] = useState([]);
  const emergencyDataCollection = collection(db, "emergencybutton");
  const currentDate = new Date();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  let navigate = useNavigate();
  const routeChange = () => {
    navigate("/management");
  };

  const deleteEmergency = async (id) => {
    const RecordDoc = doc(db, "emergencybutton", id);
    await deleteDoc(RecordDoc);
    getEmergencyData();
  };

  const handleClickOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  // useEffect(() => {
  //   console.log("$$ispoen", open);
  // });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // useEffect(() => {
  //     if (openDialog) {
  //         const timer = setTimeout(() => {
  //             handleCloseDialog();
  //         }, 5000);

  //         // Clear the timeout if the modal is closed before the timeout expires
  //         return () => clearTimeout(timer);
  //     }
  // }, [openDialog]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    AddData();
  };

  const getEmergencyData = async () => {
    try {
      const data = await getDocs(emergencyDataCollection);
      const filtered = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setemergencyData(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getEmergencyData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (changeCount > 2) {
      handleOpenDialog();
      setcounter(0);
    }
  }, [changeCount]);

  const fetchData = async () => {
    SetData([]);
    onValue(ref(realtimedb), (snapshot) => {
      setcounter((counter) => counter + 1);
      const data = snapshot.val();
      if (data != null) {
        Object.values(data).map((newdataSingle) => {
          SetDatas((oldArray) => [newdataSingle]);
        });
      }
      setChangeCount((prevCount) => prevCount + 1);
    });
  };

  const AddData = async () => {
    // console.log("$$counter",counter);
    await addDoc(emergencyDataCollection, {
      location: {
        latitude: newdata[0].Lat,
        longitude: newdata[0].Long,
      },
      nature_of_emergency: newdata[0].nature_of_emergency,
      sender: newdata[0].sender,
      status: 0,
      timestamp: {
        Date: currentDate.toLocaleDateString(),
        Time: currentDate.toLocaleTimeString(),
      },
    });
    getEmergencyData();
    // setCounter(0);
  };

  const updateEmergency = async (id) => {
    const emergencyDoc = doc(db, "emergencybutton", id);
    await updateDoc(emergencyDoc, { status: 1 });
    handleClose();
    getEmergencyData();
  };

  // useEffect(() => {
  // 	console.log("$$new");
  // 	if (counter === 2 && firstload) {
  // 		console.log("$$firstload");
  // 		setcounter(0);
  // 		setfirstload(false);
  // 	}
  // })

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("user");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <div>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <EmergencyShareRoundedIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Welcome Responder
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" onClick={routeChange}>
                    User Management
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
            <EmergencyShareRoundedIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="subtitle1"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Welcome Responder
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Button onClick={routeChange} sx={{ my: 2, color: "white", display: "block" }}>
                User Management
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <AccountCircle sx={{ color: "white" }} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem>
                  <Typography variant="text" textAlign="center" color="inherit" onClick={handleLogout}>
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ marginTop: "60px", padding: "4" }}>
        {/* Add your dashboard content here */}
        <Typography variant="h4" component="div" sx={{ paddingTop: "20px", textAlign: "center", fontWeight: "bold" }}>
          Welcome to the Dashboard
        </Typography>
        <Typography variant="body1"></Typography>
        <Paper elevation={4} sx={{ marginTop: "20px", overflowX: "auto" }}>
          <Table>
            <colgroup>
              <col style={{ width: "15%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell>Nature of Emergency</TableCell>
                <TableCell align="center">Sender (Button #)</TableCell>
                <TableCell align="center">Location (lat , long)</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Time</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {emergencyData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{row.nature_of_emergency}</TableCell>
                  <TableCell align="center">{row.sender}</TableCell>
                  <TableCell align="center">{"[" + row.location.latitude + "," + row.location.longitude + "]"}</TableCell>
                  <TableCell align="center">{row.timestamp.Date}</TableCell>
                  <TableCell align="center">{row.timestamp.Time}</TableCell>
                  <TableCell align="center">{row.status === 0 ? "Pending" : "Responded"}</TableCell>
                  <TableCell align="center">
                    <Button endIcon={<DoneAllIcon />} onClick={() => handleClickOpen(row)}></Button>
                    <Button endIcon={<DeleteIcon />} onClick={() => deleteEmergency(row.id)}></Button>
                    {/* <Button endIcon={<CancelIcon />}></Button> */}
                  </TableCell>{" "}
                  <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2" align="center" color="red">
                        Emergency Details
                      </Typography>
                      <Grid container spacing={2}>
                        {selectedRow ? (
                          <>
                            <Grid item xs={6}>
                              <Box>Nature of Emergency:</Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box>{selectedRow.nature_of_emergency}</Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box>Button Sender:</Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box>{selectedRow.sender}</Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box>Datetime of Emergency:</Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box>
                                {selectedRow.timestamp.Date} - {selectedRow.timestamp.Time}
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box>Status:</Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box>{selectedRow.status === 0 ? "Pending" : "Responded"}</Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box>Location:</Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box>{"[" + selectedRow.location.latitude + "," + selectedRow.location.longitude + "]"}</Box>
                            </Grid>
                            <Grid item xs={12}>
                              <Link
                                href={"https://www.google.com/maps?q=" + selectedRow.location.latitude + "," + selectedRow.location.longitude}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Look for location using Google Maps
                              </Link>
                            </Grid>

                            <Grid item xs={10} onClick={() => updateEmergency(selectedRow.id)}>
                              <Button variant="outlined" sx={{ left: "65%" }}>
                                Take Action
                              </Button>
                            </Grid>
                            <Grid item xs={2} onClick={handleClose}>
                              <Button variant="outlined">Back</Button>
                            </Grid>
                          </>
                        ) : (
                          <Grid item xs={12}>
                            <Box>No row selected</Box>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Modal>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title" sx={{ color: "red", fontWeight: "bold" }}>
              {"New Emergency Alert!"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {newdata.map((data, index) => (
                  <React.Fragment key={index}>
                    <Grid container spacing={1}>
                      <Grid item xs={8}>
                        <Item>Nature of Emergency:</Item>
                      </Grid>
                      <Grid item xs={4}>
                        <Item>{data.nature_of_emergency}</Item>
                      </Grid>
                      <Grid item xs={8}>
                        <Item>Sender:</Item>
                      </Grid>
                      <Grid item xs={4}>
                        <Item>{data.sender}</Item>
                      </Grid>
                      <Grid item xs={8}>
                        <Item>Longitude:</Item>
                      </Grid>
                      <Grid item xs={4}>
                        <Item>{data.Long}</Item>
                      </Grid>
                      <Grid item xs={8}>
                        <Item>Latitude:</Item>
                      </Grid>
                      <Grid item xs={4}>
                        <Item>{data.Lat}</Item>
                      </Grid>
                    </Grid>{" "}
                    <Link href={"https://www.google.com/maps?q=" + data.Lat + "," + data.Long} target="_blank" rel="noopener noreferrer">
                      Look for location using Google Maps
                    </Link>
                  </React.Fragment>
                ))}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} autoFocus>
                Okay
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </div>
  );
};

export default Dashboard;
