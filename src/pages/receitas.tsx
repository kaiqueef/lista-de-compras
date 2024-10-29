import NavBar from "./components/NavBar/NavBar";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import HandymanIcon from "@mui/icons-material/Handyman";
import { Stack, Typography } from "@mui/material";
import AddCategory from "./components/buttons/AddCategory";
import RecipeList from "./components/RecipeList/RecipeList";

export default function Receitas() {
  return (
    <>
      <NavBar
        title="Receitas"
        icon={<OutdoorGrillIcon style={{ fontSize: 70, color: "#CCC" }} />}
      />
      <Stack alignItems={"center"}>
        <AddCategory />
        <RecipeList />
      </Stack>
    </>
  );
}
