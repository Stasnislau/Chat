import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";

type UserBoxListProps = {
    children: React.ReactNode;
};

const UsersList = ({ children }: UserBoxListProps) => {
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
                height: maxHeight ? `${maxHeight}px` : {
                    mobile: "160px",
                    tablet: "160px",
                    laptop: "160px",
                    desktop: "160px",
                },
                maxHeight: maxHeight ? `${maxHeight}px` : {
                    mobile: "160px",
                    tablet: "160px",
                    laptop: "160px",
                    desktop: "160px",
                },
                flexDirection: "column",
                justifyContent: "flex-start",
                fontFamily: "Roboto",
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
                flexGrow: 1,
                margin: "1rem 0 1rem 0",
                boxSizing: "border-box",
                overflowY: "auto",
            }}
        >
            {children}
        </Box >
    );
};

export default UsersList;