import { useEffect } from "react";
import getRecipeContext from "@/context/getRecipeContext";
import { AddCategoryButton, RecipeDialog, RecipeList } from "@/components";

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
      <AddCategoryButton />
      <RecipeList />
      <RecipeDialog />
    </>
  );
}
