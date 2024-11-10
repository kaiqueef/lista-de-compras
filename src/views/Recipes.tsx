import { useEffect } from "react";
import getRecipeContext from "@/context/getRecipeContext";
import { AddCategoryButton, RecipeDialog, RecipeList } from "@/components";

export function Recipes() {
  const { recipePage } = getRecipeContext();
  useEffect(() => {
    recipePage.setProps({
      category: "",
      recipe: "",
    });
  }, []);

  return (
    <>
      <AddCategoryButton />
      <RecipeList />
      <RecipeDialog />
    </>
  );
}
