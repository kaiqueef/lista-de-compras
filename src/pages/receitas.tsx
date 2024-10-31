import NavBar from "./components/NavBar/NavBar";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import { Stack } from "@mui/material";
import AddCategoryButton from "./components/buttons/AddCategory";
import { Dialog, List } from "./components/Recipe";
import { useEffect } from "react";
import getRecipeContext from "@/context/getRecipeContext";

export default function Receitas() {
  const { recipePage } = getRecipeContext();
  useEffect(() => {
    recipePage.setProps({
      category: "",
      recipe: "",
    });
  }, []);

  return (
    <>
      <NavBar
        title="Receitas"
        icon={<OutdoorGrillIcon style={{ fontSize: 70, color: "#CCC" }} />}
      />
      <Stack alignItems={"center"}>
        <AddCategoryButton />
        <List />
        <Dialog />
      </Stack>
    </>
  );
}
