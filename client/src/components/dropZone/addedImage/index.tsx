import { Box, IconButton, Avatar } from "@mui/material";
import { Cancel } from "@mui/icons-material";

interface ComponentProps {
  source: string;
  onDelete: (source: string) => void;
  size: number;
}

const AddedImage = ({ source, onDelete, size }: ComponentProps) => {
  console.log(size, source)
  return (
    <Box
      sx={{
        width: 1,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
        height: `${size}px`,
      }}
    >
      <Avatar
        src={source}
        sx={{
          height: `${size}px`,
          width: `${size}px`,
        }}
      />
      <IconButton
        sx={{
          padding: "0",
          position: "absolute",
          top: "0.5%",
          right: "0.5%",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(source);
        }}
      >
        <Cancel />
      </IconButton>
    </Box>
  );
};

export default AddedImage;
