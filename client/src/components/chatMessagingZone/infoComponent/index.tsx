import { Box, Avatar, IconButton, Typography } from "@mui/material";
import { API_URL } from "../../../constants";
import { useContext, useState, useEffect } from "react";
import { Context } from "../../../App";
import { user } from "../../../types";
import { Call, VideoCall } from "@mui/icons-material";

const InfoComponent = ({ userId }: { userId: string }) => {
  const store = useContext(Context);
  const [user, setUser] = useState<user>();
  const fetchUser = async () => {
    try {
      store.setIsLoading(true);
      const response = await fetch(`${API_URL}/user/getById/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.status < 200 || response.status >= 300) {
        throw new Error(data.message);
      }
      setUser(data);
    } catch (error: any) {
      store.displayError(error.message);
    } finally {
      store.setIsLoading(false);
    }
  };
  useEffect(() => {
    if (store.state.userId) fetchUser();
  }, [store.state.userId]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{
            width: "50px",
            height: "50px",
          }}
          src={user?.avatar}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "10px",
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            {user?.name}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "light",
            }}
          >
            Online
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <IconButton
          sx={{
            width: "40px",
            height: "40px",
            marginRight: "10px",
          }}
        >
          <Call
            sx={{
              width: "100%",
              height: "100%",
            }}
          />
        </IconButton>
        <IconButton
          sx={{
            width: "40px",
            height: "40px",
          }}
        >
          <VideoCall
            sx={{
              width: "100%",
              height: "100%",
            }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default InfoComponent;
