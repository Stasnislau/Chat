import { Box, IconButton, Avatar } from "@mui/material";
import { Cancel } from "@mui/icons-material";

interface ComponentProps {
  source: string;
  onDelete: (source: string) => void;
  height: number;
}

const AddedImage = ({ source, onDelete, height }: ComponentProps) => {
  return (
    <Box
      sx={{
        width: 1,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        p: 1,
        boxSizing: "border-box",
      }}
    >
      <Avatar
        src={source}
        sx={{
          height: `${height}px`,
          width: `${height}px`,
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
