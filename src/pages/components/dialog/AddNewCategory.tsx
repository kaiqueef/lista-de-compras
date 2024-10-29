import { TextField } from "@mui/material";
import { useState } from "react";
import RecipeDialog from "./shared/RecipeDialog";
import getRecipeContext from "@/context/getRecipeContext";
import { Recipe } from "@/types/Recipe.type";
import { toast } from "react-toastify";

export default function AddNewCategory() {
  const {
    recipeList,
    setOpenDialogType,
    openDialogType,
    closeModal,
    localRecipeList,
  } = getRecipeContext();

  const [name, setName] = useState("");

  function handleConfirm() {
    const categoryExists = recipeList?.some(
      (recipe) => recipe.category.toLowerCase() === name.toLowerCase()
    );
    if (categoryExists) {
      return toast.error(`Categoria "${name}" já existe!`);
    }
    const newCategory: Recipe = {
      category: name,
      recipes: [],
    };
    localRecipeList.category.append(newCategory);
    setName("");
    closeModal();
    setOpenDialogType(null);
  }

  return (
    <RecipeDialog
      title="Adicionar Categoria"
      closeModal={() => setOpenDialogType(null)}
      isOpen={openDialogType === "add"}
      handleConfirm={handleConfirm}
      confirmText="Adicionar"
      disableConfirm={!name}
    >
      <TextField
        autoFocus
        margin="dense"
        label="Nome da nova categoria"
        type="text"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </RecipeDialog>
  );
}
