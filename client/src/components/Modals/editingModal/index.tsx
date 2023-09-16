import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import UploadZone from "../../dropZone/uploadZone";
const EditingModal = ({
  chosenField,
  onChange,
  open,
  onClose,
}: {
  chosenField: string;
  onChange: (value: string) => void;
  open: boolean;
  onClose: () => void;
}) => {
  const [fieldValue, setFieldValue] = useState("");
  const onsubmit = () => {
    if (fieldValue.trim() !== "") {
      onChange(fieldValue);
      onClose();
    }
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Typography fontSize={24}>Edit</Typography>
        </Box>
        {chosenField === "name" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Typography fontSize={18}>
              Enter the new value of the field
            </Typography>
            <TextField
              type="text"
              placeholder="New value"
              sx={{
                "& .MuiInputBase-root": {
                  height: "80%",
                  width: "100%",
                },
              }}
              value={fieldValue}
              onChange={(event) => {
                setFieldValue(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onsubmit();
                }
              }}
            />
            <Button
              onClick={onsubmit}
              type="submit"
              variant="text"
              color="secondary"
            >
              Submit
            </Button>
          </Box>
        )}
        {chosenField === "nickname" && (
          <Typography
            fontSize={30}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              boxSizing: "border-box",
              breakWord: "break-all",
            }}
          >
            Unfortunately, this field cannot be edited :(
          </Typography>
        )}
        {chosenField === "avatar" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              flexGrow: "1",
            }}
          >
            <Typography fontSize={18}>
              Enter the new value of the field
            </Typography>
            <Box sx={{ height: "50%" }}>
              <UploadZone onChange={setFieldValue} height="100%" width="100%" />
            </Box>
            <Button
              onClick={onsubmit}
              type="submit"
              variant="text"
              color="secondary"
            >
              Submit
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default EditingModal;
