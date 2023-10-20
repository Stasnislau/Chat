import { Box, Avatar, Typography, Skeleton } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { room } from "../../../types";
import { observer } from "mobx-react-lite";
import RoomInfoModal from "../../Modals/roomInfoModal";

const InfoComponent = observer(({ room }: { room: room | undefined }) => {
  const [height, setHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(room === undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(room === undefined || !room);
  }, [room]);
  const [isOnline, setIsOnline] = useState<string>("");
  useEffect(() => {
    if (room) {
      if (room.isOnline !== undefined) {
        if (room.isOnline) {
          setIsOnline("Online");
        } else {
          setIsOnline("Offline");
        }
      }
      else {
        setIsOnline("");
      }
    }
  }, [room]);

  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.offsetHeight);
    }
  }, [containerRef.current, window.innerHeight, window.innerWidth]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        flexGrow: 1,
        justifyContent: "space-between",
        alignItems: "center",
        p: 0.5,
        borderBox: "box-sizing",
      }}
      ref={containerRef}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          cursor: "pointer",
          flexGrow: 1,
        }}
        onClick={() => setIsModalOpen(true)}
      >
        {isLoading ? (
          <Skeleton variant="circular" sx={
            {
              width: height - 2,
              height: height - 2
            }
          } />
        ) : (
          <Avatar
            sx={{
              width: height - 2,
              height: height - 2,
            }}
            src={room?.avatar}
          />
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "10px",
          }}
        >
          {isLoading ? (
            <Skeleton variant="text" width={100} height={20} />
          ) : (
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {room?.name}
            </Typography>
          )}
          {isLoading ? (
            <Skeleton variant="text" width={100} height={20} />
          ) : (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "light",
                color: room?.isOnline ? "green" : "red",
              }}
            >
              {isOnline}
            </Typography>
          )}
        </Box>
      </Box>
      {isModalOpen && (
        <RoomInfoModal
          roomId={room?.id!}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </Box>
  );
});

export default InfoComponent;
