import { Box, Button, IconButton, Modal } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { Context } from "../../App";
import { room } from "../../types";

const AddUsersModal = (
) => {
    const store = useContext(Context);
    const [room, setRoom] = useState<room>({} as room);
    const fetchRoom = async () => {
        try {
            store.setIsLoading(true);
            const res = await fetch(`room/getById/${store.state.currentRoomId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        callingId: store.state.userId,
                    }),
                });
            const data = await res.json();
            if (res.status < 200 || res.status >= 300) {
                throw new Error(data.message);
            }
            setRoom(data.room);
        }
        catch (error: any) {
            store.displayError(error.message);
        }
        finally {
            store.setIsLoading(false);
        }
    }

    useEffect(() => {
        if (store.state.userId !== "" && store.state.currentRoomId !== "") {
            fetchRoom();
        }
    }
        , [store.state.currentRoomId, store.state.userId]);
    // return (
    //     // <Modal
    //     //     open={store.state.isAddUsersModalOpen}
    //     //     onClose={() => store.setIsAddUsersModalOpen(false)}
    //     //     aria-labelledby="modal-modal-title"
    //     //     aria-describedby="modal-modal-description"
    //     // >
    //     //     <Box sx={{
    //     //         position: "absolute",
    //     //         top: "50%",
    //     //         left: "50%",
    //     //         transform: "translate(-50%, -50%)",
    //     //         width: 400,
    //     //         bgcolor: "background.paper",
    //     //         border: "2px solid #000",
    //     //         boxShadow: 24,
    //     //         p: 4,
    //     //     }}>
    //     //         <h2 id="modal-modal-title">Add Users</h2>
    //     //         <p id="modal-modal-description">
    //     //             Add users to your room
    //     //         </p>
    //     //         <Button onClick={() => store.setIsAddUsersModalOpen(false)}>Close</Button>
    //     //     </Box>
    //     // </Modal>
    // )
}

export default AddUsersModal;