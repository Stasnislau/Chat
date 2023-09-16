import { Box, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useEffect, useState, useContext } from "react";
import AddedImage from "../addedImage";
import { fileObject } from "../../../types";
import convertBase64 from "../../../assets/convertBase64";
import { Context } from "../../../App";

interface UploadZoneProps {
  onChange: (value: string) => void;
  width?: string;
  height?: string;
}

const UploadZone = ({ onChange, width, height }: UploadZoneProps) => {
  const store = useContext(Context);
  const [file, setFile] = useState<fileObject | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxFiles: 1,
    onDrop: async (acceptedFile) => {
      try {
        if (acceptedFile.length > 0 && acceptedFile[0].size > 1000000) {
          throw new Error("File size is too big");
        }
        const fileObject = Object.assign(acceptedFile[0], {
          preview: URL.createObjectURL(acceptedFile[0]),
        }) as fileObject;
        setFile(fileObject);
      } catch (error: any) {
        store.displayError(error.message);
      }
    },
  });

  useEffect(() => {
    const func = async () => {
      try {
        if (file) {
          const fileBase64 = await convertBase64(file);
          onChange(fileBase64 as string);
        }
      } catch (error) {
        console.log(error);
      }
    };
    func();
  }, [file]);

  const onDelete = () => {
    setFile(null);
  };
  return (
    <Box
      display="flex"
      flexDirection="row"
      flexGrow="1"
      height={height}
      width={width}
    >
      <Box
        {...getRootProps()}
        sx={{
          width: file ? "100%" : "70%",
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          margin: "0",
          flex: "1",
          height: "inherit",
          flexGrow: "1",
          border: "2px dashed #ccc",
          borderRadius: "8px",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        {file ? (
          <AddedImage source={file.preview} onDelete={onDelete} />
        ) : (
          <Typography
            fontSize="1.2rem"
            color="#777"
            sx={{
              fontFamily: "Arial, sans-serif",
            }}
          >
            Drag or click to upload avatar (max 1MB)
          </Typography>
        )}
        <input hidden accept="image/*" type="file" {...getInputProps()} />
      </Box>
    </Box>
  );
};

export default UploadZone;
