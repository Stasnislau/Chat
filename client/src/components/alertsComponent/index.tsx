import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../App";
import { useContext } from "react";
import {
  Snackbar,
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
      store.state.alerts.length > 0 &&
      currentAlerts.length < 3
    ) {
      let numberOfAlerts = currentAlerts.length;
      store.state.alerts.forEach((item) => {
        if (numberOfAlerts >= 3)
          return;
        if (!currentAlerts.find((alert) => alert.id === item.id)) {
          setCurrentAlerts((prevAlerts) => [...prevAlerts, item]);
          numberOfAlerts++;
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
  return (
    <Box>
      {currentAlerts.map((item, index) => {
        setTimeout(() => {
          store.removeAlert(item.id);
          setCurrentAlerts((prevAlerts) =>
            prevAlerts.filter((alert) => alert.id !== item.id)
          );
        }, 5000);
        return (

          <Snackbar
            key={item.id}
            open={true}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            sx={{
              marginBottom: `${index * 70}px`,
              animation: "slideIn 0.5s ease-in-out",
            }}

          >
            <Alert
              sx={{
                margin: "auto",
                overflowWrap: "break-word",
                borderRadius: "1rem",
                boxShadow: "1px rgba(0,0,0,0.4)",
              }}
              severity={item.type}
              onClose={() => {
                store.removeAlert(item.id);
                setCurrentAlerts((prevAlerts) =>
                  prevAlerts.filter((alert) => alert.id !== item.id)
                );
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
        )
      })}
    </Box>
  );
});

export default MessageComponent;
