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
        height: "100%",
        position: "relative",
        // backgroundImage: `url(${source})`,
        // backgroundPosition: "center",
        // backgroundRepeat: "no-repeat",
        // backgroundSize: "cover",
        // objectFit: "cover",
      }}
    >
      <Avatar
        src={source}
        sx={{
          height: `${height}px`,
          objectFit: "cover",
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
