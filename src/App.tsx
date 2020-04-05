import React, { Fragment, useEffect } from "react";
import "./App.css";
import {
  AppBar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
interface Device {
  smart_device_iD: string;
  smart_device_name: string;
  smart_device_status: boolean;
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  card: {
    width: 500,
  },
  onButton: {
    position: "relative" as "relative",
    top: "-12px",
    left: "30px",
    fontSize: "10px",
  },
  ofButton: {
    position: "relative" as "relative",
    top: "-12px",
    left: "30px",
    fontSize: "10px",
  },
  deleteButton: {
    float: "right" as "right",
    position: "relative" as "relative",
    cursor: "pointer" as "pointer",
  },
  addDevice: {
    float: "right",
    marginRight: "86px",
    marginTop: "-8px",
    cursor: "pointer",
  },
  snackBarMessage: {
    background: "#4caf50",
    color: "white",
  },
  customDivider: {
    width: "1098px",
  },
});

const App = () => {
  const classes = useStyles();
  const [listDevices, setListDevices] = React.useState([]);
  const [snackBar, setSnackBar] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [deviceName, setDeviceName] = React.useState("");
  const [loader, setLoader] = React.useState(false);

  useEffect(() => {
    setLoader(true);
    axios.get(`http://localhost:5000/listAllDevices`).then((res) => {
      setLoader(false);
      setListDevices(res.data);
    });
  }, []);

  const reloadData = () => {
    setLoader(true);
    axios.get(`http://localhost:5000/listAllDevices`).then((res) => {
      setLoader(false);
      setListDevices(res.data);
    });
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSnackBar(true);
    setOpen(false);
    setLoader(true);
    axios
      .post(`http://localhost:5000/addDevice`, {
        deviceName: deviceName,
      })
      .then((res) => {
        reloadData();
        setTimeout(() => {
          setSnackBar(false);
        }, 3000);
      });
  };

  const deleteDevice = (deviceId: string) => {
    setLoader(true);
    axios
      .post(`http://localhost:5000/deleteDevice`, {
        deviceID: deviceId,
      })
      .then((res) => {
        reloadData();
      });
  };

  const switchOff = (smart_device_iD: string, smart_device_status: boolean) => {
    console.log(!Boolean(smart_device_status));
    setLoader(true);
    axios
      .post(`http://localhost:5000/changeSmartDeviceStatus`, {
        smartDeviceSelected: !Boolean(smart_device_status),
        deviceID: smart_device_iD,
      })
      .then((res) => {
        reloadData();
      });
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <AppBar>
        <span className="navbar">Home automation</span>
      </AppBar>
      <Container maxWidth="lg">
        <Container>
          <div className="device-title__section">
            <span>List of Devices</span>
            <span>
              <AddCircleOutlineIcon
                color="primary"
                className={classes.addDevice}
                onClick={handleClickOpen}
              />
              {/* <span>Add Device</span> */}
            </span>
          </div>
          <Divider className={classes.customDivider} />

          {loader && (
              <div className="loading-state__block">
                <CircularProgress />
              </div>
            ) || 
          <div className="contentContainer">
            <Grid container={true} spacing={2}>
              {listDevices.map((getDevice: Device) => (
                <Grid item={true} lg={6}>
                  <Card className={classes.card}>
                    <CardHeader
                      title={`${getDevice.smart_device_name} ${
                        getDevice.smart_device_status
                          ? "| current status: on"
                          : "| current status: off"
                      }`}
                    />
                    <Divider />
                    <CardContent>
                      <EmojiObjectsIcon
                        color={
                          getDevice.smart_device_status ? "primary" : "inherit"
                        }
                        fontSize="large"
                      />
                      <div className="card-button__block">
                        {getDevice.smart_device_status ? (
                          <Button
                            variant="contained"
                            color="secondary"
                            className={classes.onButton}
                            onClick={() =>
                              switchOff(
                                getDevice.smart_device_iD,
                                getDevice.smart_device_status
                              )
                            }
                          >
                            Off
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            className={classes.ofButton}
                            onClick={() =>
                              switchOff(
                                getDevice.smart_device_iD,
                                getDevice.smart_device_status
                              )
                            }
                          >
                            On
                          </Button>
                        )}
                      </div>
                      <DeleteOutlineIcon
                        color="primary"
                        className={classes.deleteButton}
                        fontSize="large"
                        onClick={() => deleteDevice(getDevice.smart_device_iD)}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          
            <div>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogContent>
                  <DialogContentText>
                    Please enter device name :
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="deviceName"
                    label="Device Name"
                    type="text"
                    fullWidth
                    onChange={(event) => setDeviceName(event.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDialogClose} color="primary">
                    cancel
                  </Button>
                  <Button onClick={handleClose} color="primary">
                    ok
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            <Snackbar
              ContentProps={{
                classes: {
                  root: classes.snackBarMessage,
                },
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              open={snackBar}
              autoHideDuration={2000}
              className="snack-bar"
              message={`Device name: [${deviceName}] has been added`}
            />
          </div>
        }
        </Container>
      </Container>
    </Fragment>
  );
};

export default App;
