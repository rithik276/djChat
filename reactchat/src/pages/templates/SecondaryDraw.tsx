import { Box, useTheme } from "@mui/material";
import axios from "axios";
import useAxiosWithInterceptor from "../../helpers/jwtinterceptor";
import React from "react";

type SecondaryDrawProps = {
  children: React.ReactNode;
};

const SecondaryDraw = ({ children }: SecondaryDrawProps) => {
  const theme = useTheme();
  const jwtAxios = useAxiosWithInterceptor();
  return (
    <Box
      sx={{
        minWidth: `${theme.secondaryDraw.width}px`,
        height: `calc(100vh - ${theme.primaryAppBar.height}px)`,
        mt: `${theme.primaryAppBar.height}px`,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: { xs: "none", sm: "block" },
        overflow: "auto",
      }}
    >
      {children}
    </Box>
  );
};

export default SecondaryDraw;
