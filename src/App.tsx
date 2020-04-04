import React, { Fragment, useState, useEffect } from "react";
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
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
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
    width: 375,
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
    marginLeft: "45%",
  },
});

const App = () => {
  const [listDevices, setListDevices] = React.useState([]);

  useEffect(() => {
    // Update the document title using the browser API
    axios.get(`http://localhost:5000/listAllDevices`).then((res) => {
      setListDevices(res.data);
      console.log(res.data);
    });
  }, []);

  const [snackBar, setSnackBar] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [deviceName, setDeviceName] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSnackBar(true);
    setOpen(false);
    axios
      .post(`http://localhost:5000/addDevice`, {
        deviceName: deviceName,
      })
      .then((res) => {
        console.log(res.data);
      });
    setTimeout(() => {
      window.location.reload();
    }, 4000);
  };

  const classes = useStyles();

  const deleteDevice = (deviceId: string) => {
    axios
      .post(`http://localhost:5000/deleteDevice`, {
        deviceID: deviceId,
      })
      .then((res) => {
        console.log(res.data);
      });
    window.location.reload();
  };

  const switchOff = (smart_device_iD: string, smart_device_status: boolean) => {
    console.log(!Boolean(smart_device_status));
    axios
      .post(`http://localhost:5000/changeSmartDeviceStatus`, {
        smartDeviceSelected: !Boolean(smart_device_status),
        deviceID: smart_device_iD,
      })
      .then((res) => {
        console.log(res.data);
      });
    window.location.reload();
  };

  return (
    <Fragment>
      <AppBar>
        <span className="navbar">Home automation</span>
      </AppBar>
      <Container>
        <div className="contentContainer">
          <Grid container={true} spacing={6}>
            {listDevices.map((getDevice: Device) => (
              <Grid item={true} lg={4}>
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
          {listDevices.length <= 0 && (
            <div className="loading-state__block">
              <CircularProgress />
            </div>
          )}
          <hr />
          <div>
            <Button
              variant="contained"
              color="primary"
              className={classes.addDevice}
              onClick={handleClickOpen}
            >
              Add device
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please enter device name below:
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="deviceName"
                  label="device Name"
                  type="text"
                  fullWidth
                  onChange={(event) => setDeviceName(event.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  submit
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            open={snackBar}
            autoHideDuration={2000}
            className="snack-bar"
            onClose={handleClose}
            message={deviceName}
          />
        </div>
      </Container>
    </Fragment>
  );
};

export default App;
