import { useContext } from "react";
import { RecipeContext } from "./recipeContext";

export default function getRecipeContext() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error(
      "useRecipeContext must be used within a RecipeProvider"
    );
  }
  return context;
}
