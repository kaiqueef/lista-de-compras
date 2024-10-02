import NavBar from "./components/NavBar/NavBar";
import ShoppingList from "./components/ShoppingList/ShoppingList";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";

import HandymanIcon from "@mui/icons-material/Handyman";
import { Stack, Typography } from "@mui/material";

export default function Receitas() {
  return (
    <>
      <NavBar
        title="Receitas"
        icon={<HandymanIcon style={{ fontSize: 70, color: "#CCC" }} />}
        // icon={<OutdoorGrillIcon style={{ fontSize: 70, color: "#CCC" }} />}
      />
      <Stack alignItems={"center"}>
        <Typography variant="h1" fontSize={40} textAlign={"center"}>
          Página em construção..
        </Typography>
        <Typography variant="h1" fontSize={40} textAlign={"center"}>
          :(
        </Typography>
      </Stack>
    </>
  );
}
