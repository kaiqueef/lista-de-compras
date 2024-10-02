import { Opacity } from "@mui/icons-material";
import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#CCC",
    },
    secondary: {
      main: "#212331",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: "#CCC",
            opacity: 0.2,
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#CCC",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          "& .MuiTypography-root, & .MuiButtonBase-root, & .Mui-focused, & .MuiButton-root.Mui-disabled":
            {
              color: "#212331",
            },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#CCC",
        },
      },
    },
  },
});
