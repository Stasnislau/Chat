import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../App";
import { useContext } from "react";
import {
  Snackbar,
  Slide,
  SlideProps,
  Box,
  Alert,
  IconButton,
  Typography,
} from "@mui/material";
import { alertInterface } from "../../types";
import { Close } from "@mui/icons-material";

const MessageComponent = observer(() => {
  const store = useContext(Context);

  const [currentAlerts, setCurrentAlerts] = useState<alertInterface[]>([]);

  useEffect(() => {
    if (
      store.state.addedAlert &&
      store.state.alerts.length > 0 &&
      currentAlerts.length < 3
    ) {
      store.state.alerts.forEach((item) => {
        if (!currentAlerts.find((alert) => alert.id === item.id)) {
          setCurrentAlerts((prevAlerts) => [...prevAlerts, item]);
        }
      });
    }
  }, [store.state.addedAlert, store.state.alerts.length, currentAlerts.length]);

  useEffect(() => {
    currentAlerts.forEach((item) => {
      if (!store.state.alerts.find((alert) => alert.id === item.id)) {
        setCurrentAlerts((prevAlerts) =>
          prevAlerts.filter((alert) => alert.id !== item.id)
        );
      }
    });
  }, [store.state.alerts.length, currentAlerts.length]);
  useEffect(() => {
    if (currentAlerts.length > 3) {
      setCurrentAlerts((prevAlerts) => prevAlerts.slice(1));
    }
  }, [currentAlerts.length]);
  return (
    <Box>
      {currentAlerts.map((item, index) => (
        <Snackbar
          key={item.id}
          open={true}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          sx={{
            marginBottom: `${index * 70}px`,
          }}
        >
          <Alert
            sx={{
              width: "100%",
              margin: "auto",
              overflowWrap: "break-word",
            }}
            severity="success"
            onClose={() => {
              store.removeAlert(item.id);
            }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  store.removeAlert(item.id);
                }}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
          >
            <Typography
              variant="body1"
              sx={{
                display: "inline",
                marginRight: "auto",
                width: "80%",
                fontFamily: "Roboto",
                fontWeight: "400",
              }}
            >
              {item.text}
            </Typography>
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
});

export default MessageComponent;
