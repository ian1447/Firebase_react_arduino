import React, { useEffect, useState, useRef } from "react";
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
	TextField,
	MenuItem,
	Modal,
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	Menu,
	Tooltip,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Avatar,
	FormControl,
	InputLabel,
	Input,
	FormHelperText,
} from "@mui/material";
import { auth, db } from "../../config/firebase";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
	getDocs,
	collection,
	addDoc,
	deleteDoc,
	updateDoc,
	doc,
} from "firebase/firestore";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import EmergencyShareRoundedIcon from "@mui/icons-material/EmergencyShareRounded";
import AddCardIcon from "@mui/icons-material/AddCard";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: "center",
//   color: theme.palette.text.secondary,
// }));

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

const sex = [
	{
		value: "Male",
		label: "Male",
	},
	{
		value: "Female",
		label: "Female",
	},
];

const UserManagement = () => {
	// main
	const Buttonusers = collection(db, "button_users");
	const Buttonrecords = collection(db, "button_user_records");
	const [user, setUser] = useState(null);
	const [UserData, setUserData] = useState([]);
	const [UserRecords, setUserRecords] = useState([]);
	const [openDialog, setOpenDialog] = React.useState(false);

	// Dialog State
	const [newRecord, setnewRecord] = useState("");
	const [newName, setnewName] = useState("");
	const [newAge, setnewAge] = useState(0);
	const [newButtonNumber, setnewButtonNumber] = useState(0);
	const [newSex, setnewSex] = useState("");
	const [newAddress, setnewAddress] = useState("");
	const [newBdate, setNewBdate] = useState("");
	const [newPhoneNumber, setNewPhoneNumber] = useState("");
	const [newHeight, setNewHeight] = useState("");
	const [newWeight, setNewWeight] = useState(0);
	const [newBMI, setNewBMI] = useState("");
	const [newBloodType, setNewBloodType] = useState("");
	const [newContactPerson, setNewContactPerson] = useState("");
	const [newContactNumber, setNewContactNumber] = useState(0);
	const [newContactPerson2, setNewContactPerson2] = useState("");
	const [newContactNumber2, setNewContactNumber2] = useState(0);

	const [selectedRow, setSelectedRow] = useState(null);
	const [open, setOpen] = React.useState(false);
	const [EditOpen, setEditOpen] = React.useState(false);
	const [RecordsOpen, setRecordsOpen] = React.useState(false);
	const UpdateName = useRef(null);
	const UpdateAge = useRef(null);
	const UpdateButtonNumber = useRef(null);
	const UpdateSex = useRef(null);
	const UpdateAddress = useRef(null);
	const UpdateBdate = useRef(null);
	const UpdatePhoneNumber = useRef(null);
	const UpdateHeight = useRef(null);
	const UpdateWeight = useRef(null);
	const UpdateBMI = useRef(null);
	const UpdateBloodType = useRef(null);
	const UpdateContactPerson = useRef(null);
	const UpdateContactNumber = useRef(null);
	const UpdateContactPerson2 = useRef(null);
	const UpdateContactNumber2 = useRef(null);

	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const GetButtonUserData = async () => {
		try {
			const data = await getDocs(Buttonusers);
			const filtered = data.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}));
			setUserData(filtered);
		} catch (err) {
			console.error(err);
		}
	};

	const GetButtonUserRecords = async () => {
		try {
			const records = await getDocs(Buttonrecords);
			const filtered = records.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}));
			setUserRecords(filtered);
			setnewRecord("");
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		GetButtonUserData();
	}, []);

	const handleDeleteClickOpen = (row) => {
		setSelectedRow(row);
		setOpen(true);
	};

	const handleRecordsOpen = (row) => {
		GetButtonUserRecords();
		setSelectedRow(row);
		setRecordsOpen(true);
	};

	// useEffect(() => {
	//   console.log("$$records", UserRecords);
	// });

	const handleEditClickOpen = (row) => {
		setSelectedRow(row);
		setEditOpen(true);
	};

	const handleRecordsClose = () => setRecordsOpen(false);
	const handleDeleteClose = () => setOpen(false);
	const handleEditClose = () => setEditOpen(false);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((currentUser) => {
			setUser(currentUser);
		});

		return () => unsubscribe();
	}, []);

	let navigate = useNavigate();
	const routeChange = () => {
		navigate("/dashboard");
	};

	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const OnSubmitNewButtonUser = async () => {
		try {
			await addDoc(Buttonusers, {
				address: newAddress,
				age: newAge,
				button_number: newButtonNumber,
				name: newName,
				sex: newSex,
				bday: newBdate,
				number: newPhoneNumber,
				height: newHeight,
				weight: newWeight,
				bmi: newBMI,
				blood_type: newBloodType,
				emergency_contact: newContactPerson,
				emergency_contact_number: newContactNumber,
				emergency_contact_person_2: newContactPerson2,
				emergency_contact_number_2: newContactNumber2,
			});
			handleCloseDialog();
			GetButtonUserData();
		} catch (err) {
			console.error(err);
		}
	};

	const OnSubmitNewRecord = async (button_user_id) => {
		try {
			await addDoc(Buttonrecords, {
				button_user_id: button_user_id,
				sickness: newRecord,
			});
			GetButtonUserRecords();
		} catch (err) {
			console.error(err);
		}
	};

	const deleteUser = async (id) => {
		const UserDoc = doc(db, "button_users", id);
		await deleteDoc(UserDoc);
		GetButtonUserData();
	};

	const deleteUserRecords = async (id) => {
		const RecordDoc = doc(db, "button_user_records", id);
		await deleteDoc(RecordDoc);
		GetButtonUserRecords();
	};

	const UpdateUser = async (id) => {
		try {
			// const Name = UpdateName.current.value;
			// const Age = UpdateAge.current.value;
			// const Address = UpdateAddress.current.value;
			// const Sex = UpdateSex.current.value;
			// const ButtonNumber = UpdateButtonNumber.current.value;
			const UserDoc = doc(db, "button_users", id);
			await updateDoc(UserDoc, {
				address: UpdateAddress.current.value,
				age: UpdateAge.current.value,
				button_number: UpdateButtonNumber.current.value,
				name: UpdateName.current.value,
        sex: UpdateSex.current.value,
        bday: UpdateBdate.current.value,
				number: UpdatePhoneNumber.current.value,
				height: UpdateHeight.current.value,
				weight: UpdateWeight.current.value,
				bmi: UpdateBMI.current.value,
				blood_type: UpdateBloodType.current.value,
				emergency_contact: UpdateContactPerson.current.value,
				emergency_contact_number: UpdateContactNumber.current.value,
				emergency_contact_person_2: UpdateContactPerson2.current.value,
				emergency_contact_number_2: UpdateContactNumber2.current.value,
			});
			handleEditClose();
			GetButtonUserData();
		} catch (err) {
			console.error("$$error", err);
		}
	};

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
						<EmergencyShareRoundedIcon
							sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
						/>
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
						<EmergencyShareRoundedIcon
							sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
						/>
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
							<Button
								onClick={routeChange}
								sx={{ my: 2, color: "white", display: "block" }}
							>
								Dashboard
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
									<Typography
										variant="text"
										textAlign="center"
										color="inherit"
										onClick={handleLogout}
									>
										Logout
									</Typography>
								</MenuItem>
							</Menu>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>

			<Container maxWidth="xl" sx={{ marginTop: "20px" }}>
				<Typography
					variant="h4"
					component="div"
					sx={{ paddingTop: "80px", paddingLeft: "20px" }}
				>
					Button User Managament
				</Typography>
				<Typography variant="body1"></Typography>
				<Paper elevation={4} sx={{ marginTop: "20px" }}>
					<Button
						variant="contained"
						sx={{ marginTop: "2vh", marginLeft: "2vh" }}
						onClick={handleOpenDialog}
					>
						Add User
					</Button>
					<Table>
						<colgroup>
							<col style={{ width: "15%" }} />
							<col style={{ width: "20%" }} />
						</colgroup>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: "bold", fontSize: "1.8vh" }}>
									BUTTON NUMBER
								</TableCell>
								<TableCell
									align="center"
									sx={{ fontWeight: "bold", fontSize: "1.8vh" }}
								>
									NAME
								</TableCell>
								<TableCell
									align="center"
									sx={{ fontWeight: "bold", fontSize: "1.8vh" }}
								>
									ADDRESS
								</TableCell>
								<TableCell
									align="center"
									sx={{ fontWeight: "bold", fontSize: "1.8vh" }}
								>
									AGE
								</TableCell>
								<TableCell
									align="center"
									sx={{ fontWeight: "bold", fontSize: "1.8vh" }}
								>
									SEX
								</TableCell>
								<TableCell
									align="center"
									sx={{ fontWeight: "bold", fontSize: "1.8vh" }}
								>
									ACTION
								</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{UserData.map(
								(row, index) => (
									(
										<TableRow key={index}>
											<TableCell align="center">{row.button_number}</TableCell>
											<TableCell align="center">{row.name}</TableCell>
											<TableCell align="center">{row.address}</TableCell>
											<TableCell align="center">{row.age}</TableCell>
											<TableCell align="center">{row.sex}</TableCell>
											<TableCell align="center">
												<Button
													endIcon={<AddCardIcon />}
													onClick={() => handleRecordsOpen(row)}
												></Button>
												<Button
													endIcon={<EditIcon />}
													onClick={() => handleEditClickOpen(row)}
												></Button>
												<Button
													endIcon={<PersonRemoveIcon />}
													onClick={() => handleDeleteClickOpen(row)}
												></Button>
											</TableCell>
											<Modal
												open={open}
												onClose={handleDeleteClose}
												aria-labelledby="modal-modal-title"
												aria-describedby="modal-modal-description"
												fullWidth
												maxWidth="sm"
											>
												<Box sx={style}>
													<Typography
														id="modal-modal-title"
														variant="h6"
														component="h2"
														align="center"
														color="red"
													>
														Confirm Delete?
													</Typography>
													<Grid container spacing={2}>
														{selectedRow ? (
															<>
																<Grid item xs={6}>
																	<Button
																		variant="contained"
																		onClick={() => deleteUser(row.id)}
																		fullWidth
																	>
																		Confirm
																	</Button>
																</Grid>
																<Grid item xs={6} onClick={handleDeleteClose}>
																	<Button variant="outlined" fullWidth>
																		Back
																	</Button>
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
											<Dialog
												open={EditOpen}
												onClose={handleEditClose}
												aria-labelledby="alert-dialog-title"
												aria-describedby="alert-dialog-description"
												fullWidth
												maxWidth="md"
											>
												<DialogTitle>{"Edit User"}</DialogTitle>
												<DialogContent>
													<DialogContentText id="alert-dialog-description">
														<React.Fragment>
															<Grid container spacing={1}>
																<Grid item xs={12} color="red" marginTop={2}>
																	User Information:{" "}
																</Grid>

																<Grid item xs={6}>
																	<TextField
																		id="UpdateName"
																		label="Name"
																		variant="standard"
																		inputRef={UpdateName}
																		defaultValue={row.name}
																		fullWidth
																		required
																	/>
																</Grid>
																<Grid item xs={2}>
																	<FormControl fullWidth variant="standard">
																		<InputLabel htmlFor="standard-adornment-amount"></InputLabel>
																		<Input
																			id="UpdateBdate"
																			type="date"
																			inputRef={UpdateBdate}
																			defaultValue={row.bday}
																		/>
																		<FormHelperText id="standard-weight-helper-text">
																			Birthdate
																		</FormHelperText>
																	</FormControl>
																</Grid>
																<Grid item xs={2}>
																	<TextField
																		id="UpdateAge"
																		label="Age"
																		variant="standard"
																		type="Number"
																		inputRef={UpdateAge}
																		defaultValue={row.age}
																		required
																	/>
																</Grid>
																<Grid item xs={2}>
																	<TextField
																		id="UpdateSex"
																		select
																		label="Select"
																		variant="standard"
																		helperText="Select Sex"
																		inputRef={UpdateSex}
																		defaultValue={row.sex}
																		fullWidth
																	>
																		{sex.map((option) => (
																			<MenuItem
																				key={option.value}
																				value={option.value}
																			>
																				{option.label}
																			</MenuItem>
																		))}
																	</TextField>
																</Grid>
																<Grid item xs={8}>
																	<TextField
																		id="UpdateAddress"
																		label="Address"
																		variant="standard"
																		inputRef={UpdateAddress}
																		defaultValue={row.address}
																		fullWidth
																		required
																	/>
																</Grid>
																<Grid item xs={4}>
																	<TextField
																		id="UpdatePhoneNumber"
																		label="Phone Number"
																		variant="standard"
																		inputRef={UpdatePhoneNumber}
																		defaultValue={row.number}
																		fullWidth
																		required
																	/>
																</Grid>
																<Grid item xs={3}>
																	<TextField
																		id="UpdateHeight"
																		label="Height"
																		variant="standard"
																		inputRef={UpdateHeight}
																		defaultValue={row.height}
																		fullWidth
																		required
																	/>
																</Grid>
																<Grid item xs={3}>
																	<TextField
																		id="UpdateWeight"
																		label="Weight"
																		variant="standard"
																		inputRef={UpdateWeight}
																		defaultValue={row.weight}
																		fullWidth
																		required
																	/>
																</Grid>
																<Grid item xs={3}>
																	<TextField
																		id="UpdateBMI"
																		label="BMI"
																		variant="standard"
																		inputRef={UpdateBMI}
																		defaultValue={row.bmi}
																		fullWidth
																		required
																	/>
																</Grid>
																<Grid item xs={3}>
																	<TextField
																		id="UpdateBloodType"
																		label="Blood Type"
																		variant="standard"
																		inputRef={UpdateBloodType}
																		defaultValue={row.blood_type}
																		fullWidth
																		required
																	/>
																</Grid>

																<Grid item xs={12} color="red" marginTop={2}>
																	Emergency Contact Information:{" "}
																</Grid>

																<Grid item xs={8}>
																	<TextField
																		id="UpdateContactPerson"
																		label="Emergency Contact Person"
																		variant="standard"
																		inputRef={UpdateContactPerson}
																		defaultValue={row.emergency_contact}
																		fullWidth
																		required
																	/>
																</Grid>
																<Grid item xs={4}>
																	<TextField
																		id="UpdateContactNumber"
																		label="Emergency Contact Number"
																		variant="standard"
																		inputRef={UpdateContactNumber}
																		defaultValue={row.emergency_contact_number}
																		fullWidth
																		required
																	/>
																</Grid>
																<Grid item xs={8}>
																	<TextField
																		id="UpdateContactPerson2"
																		label="Emergancy Contact Person 2"
																		variant="standard"
																		inputRef={UpdateContactPerson2}
																		defaultValue={
																			row.emergency_contact_person_2
																		}
																		fullWidth
																		required
																	/>
																</Grid>
																<Grid item xs={4}>
																	<TextField
																		id="UpdateContactNumber2"
																		label="Emergency Contact Number 2"
																		variant="standard"
																		inputRef={UpdateContactNumber2}
																		defaultValue={
																			row.emergency_contact_number_2
																		}
																		fullWidth
																		required
																	/>
																</Grid>
																<Grid item xs={2}>
																	<TextField
																		id="UpdateButtonNumber"
																		label="Button #"
																		variant="standard"
																		type="Number"
																		inputRef={UpdateButtonNumber}
																		defaultValue={row.button_number}
																		required
																	/>
																</Grid>
															</Grid>{" "}
														</React.Fragment>
													</DialogContentText>
												</DialogContent>
												<DialogActions>
													<Button
														onClick={() => UpdateUser(row.id)}
														variant="contained"
														autoFocus
													>
														Edit
													</Button>
													<Grid
														item
														xs={2}
														onClick={handleEditClose}
														color={"anger"}
													>
														<Button>Back</Button>
													</Grid>
												</DialogActions>
											</Dialog>
											{/*  records */}
											<Dialog
												open={RecordsOpen}
												onClose={handleRecordsClose}
												aria-labelledby="alert-dialog-title"
												aria-describedby="alert-dialog-description"
												fullWidth
												maxWidth="sm"
											>
												<DialogTitle>
													{"User Records for "}
													{row.name}
													{" Button Number: "} {row.button_number}
												</DialogTitle>
												<DialogContent>
													<List dense={false}>
														{UserRecords.filter((recordrow) => {
															return recordrow.button_user_id === row.id;
														}).map((recordrow, index) => (
															<ListItem
																secondaryAction={
																	<IconButton
																		edge="end"
																		aria-label="delete"
																		onClick={() =>
																			deleteUserRecords(recordrow.id)
																		}
																	>
																		<DeleteIcon />
																	</IconButton>
																}
															>
																<ListItemAvatar>
																	<Avatar>
																		<RadioButtonCheckedIcon />
																	</Avatar>
																</ListItemAvatar>
																<ListItemText primary={recordrow.sickness} />
															</ListItem>
														))}
														<Grid
															container
															spacing={1}
															sx={{ paddingLeft: "15px" }}
														>
															<Grid item xs={10}>
																<TextField
																	id="Record"
																	label="sickness"
																	variant="standard"
																	type="text"
																	value={newRecord}
																	onChange={(e) => setnewRecord(e.target.value)}
																	fullWidth
																	required
																/>
															</Grid>
															<Grid
																item
																xs={2}
																style={{
																	paddingTop: "2.5vh",
																	paddingLeft: "5.5vh",
																}}
															>
																<IconButton
																	edge="end"
																	aria-label="add"
																	onClick={() => OnSubmitNewRecord(row.id)}
																>
																	<AddIcon />{" "}
																</IconButton>
															</Grid>
														</Grid>
														{""}
													</List>
													{/* {UserData.map((row, index) => (
                        <Grid item xs={2} onClick={handleRecordsClose} color={"anger"}>
                          <Button>Back</Button>
                        </Grid>
                      ))} */}
												</DialogContent>
												<DialogActions>
													<Grid
														item
														xs={2}
														onClick={handleRecordsClose}
														color={"anger"}
													>
														<Button>Back</Button>
													</Grid>
												</DialogActions>
											</Dialog>
										</TableRow>
									)
								)
							)}
						</TableBody>
					</Table>
				</Paper>
			</Container>
			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullWidth
				maxWidth="md"
				sx={{ overflow: "auto" }}
			>
				<DialogTitle>{"Add New User"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						<React.Fragment>
							<Grid container spacing={2}>
								<Grid item xs={12} color="red" marginTop={2}>
									User Information:{" "}
								</Grid>

								<Grid item xs={6}>
									<TextField
										id="NewName"
										label="Name"
										variant="standard"
										onChange={(e) => setnewName(e.target.value)}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={2}>
									<FormControl fullWidth variant="standard">
										<InputLabel htmlFor="standard-adornment-amount"></InputLabel>
										<Input
											id="NewBdate"
											type="date"
											onChange={(e) => setNewBdate(e.target.value)}
										/>
										<FormHelperText id="standard-weight-helper-text">
											Birthdate
										</FormHelperText>
									</FormControl>
								</Grid>
								<Grid item xs={2}>
									<TextField
										id="NewAge"
										label="Age"
										variant="standard"
										type="Number"
										onChange={(e) => setnewAge(e.target.value)}
										required
									/>
								</Grid>
								<Grid item xs={2}>
									<TextField
										id="NewSex"
										select
										label="Select"
										variant="standard"
										helperText="Select Sex"
										onChange={(e) => setnewSex(e.target.value)}
										fullWidth
									>
										{sex.map((option) => (
											<MenuItem key={option.value} value={option.value}>
												{option.label}
											</MenuItem>
										))}
									</TextField>
								</Grid>
								<Grid item xs={8}>
									<TextField
										id="NewAddress"
										label="Address"
										variant="standard"
										onChange={(e) => setnewAddress(e.target.value)}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										id="NewPhoneNumber"
										label="Phone Number"
										variant="standard"
										onChange={(e) => setNewPhoneNumber(e.target.value)}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={3}>
									<TextField
										id="NewHeight"
										label="Height"
										variant="standard"
										onChange={(e) => setNewHeight(e.target.value)}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={3}>
									<TextField
										id="NewWeight"
										label="Weight"
										variant="standard"
										onChange={(e) => setNewWeight(e.target.value)}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={3}>
									<TextField
										id="NewBMI"
										label="BMI"
										variant="standard"
										onChange={(e) => setNewBMI(e.target.value)}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={3}>
									<TextField
										id="NewBloodType"
										label="Blood Type"
										variant="standard"
										onChange={(e) => setNewBloodType(e.target.value)}
										fullWidth
										required
									/>
								</Grid>

								<Grid item xs={12} color="red" marginTop={2}>
									Emergency Contact Information:{" "}
								</Grid>

								<Grid item xs={8}>
									<TextField
										id="NewContactPerson"
										label="Emergency Contact Person"
										variant="standard"
										onChange={(e) => setNewContactPerson(e.target.value)}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										id="NewContactNumber"
										label="Emergency Contact Number"
										variant="standard"
										onChange={(e) => setNewContactNumber(e.target.value)}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={8}>
									<TextField
										id="NewContactPerson2"
										label="Emergancy Contact Person 2"
										variant="standard"
										onChange={(e) => setNewContactPerson2(e.target.value)}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										id="NewContactNumber2"
										label="Emergency Contact Number 2"
										variant="standard"
										onChange={(e) => setNewContactNumber2(e.target.value)}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={2}>
									<TextField
										id="NewButtonNumber"
										label="Button #"
										variant="standard"
										type="Number"
										onChange={(e) => setnewButtonNumber(e.target.value)}
										required
									/>
								</Grid>
							</Grid>{" "}
						</React.Fragment>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={OnSubmitNewButtonUser} variant="contained" autoFocus>
						Save
					</Button>
					<Grid item xs={2} onClick={handleCloseDialog} color={"anger"}>
						<Button>Back</Button>
					</Grid>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default UserManagement;
