import React, { useState, useEffect, useContext, useRef } from "react";
import { Box } from "@mui/material";
import io, { Socket } from "socket.io-client";
import { Context } from "../../../App";
import { API_URL } from "../../../constants";
import { extendedRoom, message } from "../../../types";
import ChatTextField from "../chatTextField";
import MessageBubble from "../messageBubble";
import { observer } from "mobx-react-lite";
const MessagingZone = observer(
  ({
    avatars,
    setShouldUpdateRoom,
  }: {
    avatars: {
      id: string;
      avatar: string;
    }[];
    setShouldUpdateRoom: (value: boolean) => void;
  }) => {
    const store = useContext(Context);
    const [rooms, setRooms] = useState<extendedRoom[]>([]);
    const [socket, setSocket] = useState<Socket>();
    const [record, setRecord] = useState<Blob | null>(null);
    const messageListener = (message: message) => {
      if (message.roomId !== store.state.currentRoomId) {
        store.setShouldUpdateRooms(true);
        return;
      }
      setMessageHistory([...messageHistory, message]);
    };

    const [messageHistory, setMessageHistory] = useState<message[]>([]);

    const handleSendVoiceMessage = (recording: Blob) => {
      const message = {
        userId: store.state.userId,
        roomId: store.state.currentRoomId,
        text: "",
        user: {
          name: store.state.userName,
        },
      }
      socket?.emit("message", { message, room: store.state.currentRoomId });
      store.setShouldUpdateRooms(true);
    }
    const handleSendMessage = (text: string, room: string) => {
      const message = {
        userId: store.state.userId,
        text: text,
        roomId: store.state.currentRoomId,
        user: {
          name: store.state.userName,
        },
      };
      socket?.emit("message", { message, room });
      store.setShouldUpdateRooms(true);
    };

    const fetchMessages = async () => {
      try {
        store.setIsLoading(true);
        const response = await fetch(
          `${API_URL}/room/getMessages/${store.state.currentRoomId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.status < 200 || response.status >= 300) {
          throw new Error(data.message);
        }
        setMessageHistory(data);
      } catch (error: any) {
        store.displayError(error.message);
      } finally {
        store.setIsLoading(false);
      }
    };
    function getVisibleMessages(): message[] {
      const messageBubbles = document.querySelectorAll(".message-bubble");
      const messageHistoryContainer = document.querySelector(
        ".message-history-container"
      );
      const messageHistoryRect =
        messageHistoryContainer?.getBoundingClientRect();
      const visibleMessages = [];
      for (let i = 0; i < messageBubbles.length; i++) {
        const messageBubble = messageBubbles[i];
        const messageBubbleRect = messageBubble.getBoundingClientRect();
        if (!messageHistoryRect) return [];
        if (
          messageBubbleRect.top >= messageHistoryRect.top &&
          messageBubbleRect.bottom <= messageHistoryRect.bottom
        ) {
          visibleMessages.push(messageHistory[i]);
        }
      }
      return visibleMessages;
    }
    useEffect(() => {
      if (store.state.currentRoomId !== "") {
        fetchMessages();
      }
    }, [store.state.currentRoomId]);

    useEffect(() => {
      if (store.state.userId) {
        socket?.emit("online-status", {
          userId: store.state.userId,
          isOnline: true,
        });
      }
      const handleUnload = () => {
        if (store.state.userId) {
          socket?.emit("online-status", {
            userId: store.state.userId,
            isOnline: false,
          });
        }
      };
      window.addEventListener("beforeunload", handleUnload);
      return () => {
        window.removeEventListener("beforeunload", handleUnload);
      };
    }, [store.state.userId, socket]);

    useEffect(() => {
      const socket = io("http://localhost:8001");
      setSocket(socket);
    }, [setSocket]);
    useEffect(() => {
      const fetchRooms = async () => {
        try {
          store.setIsLoading(true);
          const response = await fetch(
            `${API_URL}/room/getByUserId/${store.state.userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          if (response.status < 200 || response.status >= 300) {
            throw new Error(data.message);
          }
          setRooms(data);
        } catch (error: any) {
          store.displayError(error.message);
        } finally {
          store.setIsLoading(false);
        }
      };
      if (store.state.userId !== "") {
        fetchRooms();
      }
    }, [socket, store.state.userId]);

    useEffect(() => {
      rooms.forEach((room) => {
        socket?.emit("join-room", room.id);
      });
    }, [rooms, socket, rooms]);

    useEffect(() => {
      socket?.on("message", messageListener);
      return () => {
        socket?.off("message", messageListener);
      };
    }, [socket, messageHistory]);

    useEffect(() => {
      socket?.on("changed-online-status", (roomId: string) => {
        if (roomId === store.state.currentRoomId) {
          setShouldUpdateRoom(true);
        }
      });
    }, [socket, store.state.currentRoomId]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }, [messageHistory.length]);

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          position: "relative",
          padding: "0 2%",
          height: "100%",
          flexBox: "1",
          backgroundColor: "secondary.main",
          boxSizing: "border-box",
          resize: "none",
        }}
      >
        <Box
          sx={{
            width: "100%",
            minHeight: "60%",
            overflowY: "scroll",
            boxSizing: "border-box",
          }}
          component="div"
          className="message-history-container"
          onScroll={() => {
            const visibleMessages = getVisibleMessages()?.filter(
              (message) =>
                !message.isRead && message.userId !== store.state.userId
            );
            if (visibleMessages.length === 0) return;
            if (visibleMessages && visibleMessages.length > 0) {
              visibleMessages.forEach((message) => {
                if (!message.isRead && message.userId !== store.state.userId) {
                  socket?.emit("read-message", {
                    messageId: message.id,
                  });
                  setMessageHistory((prev) =>
                    prev.map((prevMessage) => {
                      if (prevMessage.id === message.id) {
                        return { ...prevMessage, isRead: true };
                      }
                      return prevMessage;
                    })
                  );
                }
              });
              store.setShouldUpdateRooms(true);
            }
          }}
        >
          {messageHistory.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              isMine={message.userId === store.state.userId}
              avatars={avatars}
            />
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            boxSizing: "border-box",
            minHeight: "15%",
          }}
        >
          <ChatTextField onSend={handleSendMessage} onRecord={setRecord} />
        </Box>
      </Box>
    );
  }
);

export default MessagingZone;
