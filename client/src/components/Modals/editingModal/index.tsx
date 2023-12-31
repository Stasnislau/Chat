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
  const [error, setError] = useState("");
  const onsubmit = () => {
    if (fieldValue.trim() !== "") {
      onChange(fieldValue);
      onClose();
    } else {
      setError("Field cannot be empty");
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
          width: {
            mobile: "70%",
            tablet: "50%",
            laptop: "30%",
            desktop: "30%",
          },
          height: "30%",
          borderRadius: "1rem",
          boxShadow: 24,
          p: 2,
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
            <Typography sx={
              {
                fontSize: {
                  mobile: 12,
                  tablet: 14,
                  laptop: 16,
                  desktop: 18,
                }
              }
            }>
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
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              flexGrow: "1",
            }}
          >
            <Typography fontSize={18}>
              Enter the new value of the field
            </Typography>
            <Box sx={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "1rem",
              flexGrow: "1",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <UploadZone onChange={setFieldValue}/>
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
        {error && (
          <Typography
            fontSize={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              boxSizing: "border-box",
              breakWord: "break-all",
              color: "#FF0000",
            }}
          >
            {error}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default EditingModal;
