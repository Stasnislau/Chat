import { Avatar, Box, IconButton, Modal, Typography } from "@mui/material";
const UsersListModal = ({
  usersList,
  open,
  setOpen,
  handleClick,
}: {
  usersList: { id: string; avatar: string }[];
  open: boolean;
  setOpen: (value: boolean) => void;
  handleClick: (additionalId: string) => void;
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Roboto",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          width: "30%",
          height: "30%",
          borderRadius: "1rem",
          boxShadow: 24,
          padding: "1%",
          display: "flex",
          flexDirection: "column",
          borderBox: "box-sizing",
          border: "none",
        }}
      >
        <Typography fontSize={24}>Users</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            overflowY: "auto",
            maxHeight: "100%",
            width: "100%",
          }}
        >
          {usersList.map((user) => (
            <IconButton
              key={user.id}
              sx={{
                width: "50px",
                height: "50px",
                margin: "5px",
              }}
              onClick={async () => {
                handleClick(user.id);
                setOpen(false);
              }}
            >
              <Avatar src={user.avatar} />
            </IconButton>
          ))}
        </Box>
      </Box>
    </Modal>
  );
};

export default UsersListModal;
