import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

export const StyledTextField = styled(TextField)({
  fontSize: "1.2rem",
  fontWeight: "400",
  fontFamily: "Roboto",
  backgroundColor: "#f5f5f5",
  borderRadius: "99999999px",
  color: "#a372ca",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#a372ca",
      borderRadius: "99999999px",
    },
    "&:hover fieldset": {
      borderColor: "#a372ca",
      borderRadius: "99999999px",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#a372ca",
      borderRadius: "99999999px",
    },
  },
});
