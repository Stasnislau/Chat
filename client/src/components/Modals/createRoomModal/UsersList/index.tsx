import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";

type UserBoxListProps = {
    children: React.ReactNode;
    isFull?: boolean;
};

const UsersList = ({ children, isFull = false }: UserBoxListProps) => {
    const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const box = boxRef.current;
        if (box) {
            const childHeight = box.firstElementChild?.clientHeight;
            if (childHeight) {
                setMaxHeight(childHeight * 2.5);
            }
        }
    }, [children]);


    return (
        <Box
            ref={boxRef}
            sx={{
                display: "flex",
                width: 1,
                maxHeight: maxHeight !== 0 && !isFull ? `${maxHeight}px` : "none",
                height: isFull ? "auto" : maxHeight !== 0 && maxHeight ? `${maxHeight}px` : {
                    mobile: "160px",
                    tablet: "160px",
                    laptop: "160px",
                    desktop: "160px",
                },
                minHeight: 0,
                flexDirection: "column",
                justifyContent: "flex-start",
                fontFamily: "Roboto",
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
                margin: "1rem 0 1rem 0",
                flexGrow: 1,
                boxSizing: "border-box",
                overflowY: "auto",
            }}
        >
            {children}
        </Box >
    );
};

export default UsersList;