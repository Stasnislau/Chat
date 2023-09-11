import { Box, IconButton } from "@mui/material";
import { Cancel } from "@mui/icons-material";

interface ComponentProps {
  source: string;
  onDelete: (source: string) => void;
}

const AddedImage = ({ source, onDelete }: ComponentProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "red",
        position: "relative",
        backgroundImage: `url(${source})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        objectFit: "cover",
      }}
    >

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
