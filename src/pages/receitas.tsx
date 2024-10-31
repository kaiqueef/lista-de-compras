import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import { Stack } from "@mui/material";
import { useEffect } from "react";
import getRecipeContext from "@/context/getRecipeContext";
import { AddCategoryButton, Dialog, RecipeList, NavBar } from "@/components";

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
        <RecipeList />
        <Dialog />
      </Stack>
    </>
  );
}
