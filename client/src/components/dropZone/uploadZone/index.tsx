import { Box, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useEffect, useState, useContext, useRef } from "react";
import AddedImage from "../addedImage";
import { fileObject } from "../../../types";
import convertBase64 from "../../../assets/convertBase64";
import { Context } from "../../../App";

interface UploadZoneProps {
  onChange: (value: string) => void;
}

const UploadZone = ({ onChange }: UploadZoneProps) => {
  const store = useContext(Context);
  const [height, setHeight] = useState<number>(0);
  const boxRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const box = boxRef.current;
    if (box && !file) {
      console.log(box.clientHeight, 'box')
      setHeight(box.clientHeight);
    }
  }, [boxRef])
  
  const onDelete = () => {
    setFile(null);
  };
  return (
    <Box
      ref={boxRef}
      sx={
        {
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          width: 1,
        }
      }
    >
      <Box
        {...getRootProps()}
        sx={{
          width: file && file == null ? 0.7 : 1,
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          flexGrow: 1,
          border: "2px dashed #ccc",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {file ? (
          <AddedImage source={file.preview} onDelete={onDelete} height={height} />
        ) : (
          <Typography

            sx={{
              fontFamily: "Arial, sans-serif",
              fontSize: {
                mobile: "0.8rem",
                tablet: "1rem",
                laptop: "1.2rem",
                desktop: "1.4rem",
              },
              color: "#777",
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
