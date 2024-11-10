import { Box, styled } from "@mui/material";

export const NavBarOption = styled(Box)(() => ({
  transition: "0.5s",
  "&.active": {
    scale: 1,
  },
  "&:not(.active)": {
    scale: 0.7,
    opacity: 0.5,
  },
}));
