import getRecipeContext from "@/context/getRecipeContext";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RecipeDialog from "../dialog/shared/RecipeDialog";
import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function RecipeList() {
  const { recipeList, setOpenDialogType, openDialogType, localRecipeList } =
    getRecipeContext();
  const [name, setName] = useState("");
  const [openDialog, setOpenDialog] = useState<
    "add" | "edit" | "delete" | null
  >(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openRecipe, setOpenRecipe] = useState<string | null>(null);

  //TODO:: PASS ALL THIS TO HOOK
  const handleClickOpen = (category: string) => {
    setOpenCategory(category);
  };

  function closeModal() {
    setOpenDialog(null);
    setOpenRecipe(null);
    setName("");
    setOpenDialogType(null);
  }

  function handleConfirmNewRecipe() {
    const recipe = recipeList?.find(
      (item) => item.category === openCategory
    )?.recipes;
    const recipeExists = recipe?.some(
      (recipe) => recipe.name.toLowerCase() === name.toLowerCase()
    );
    if (recipeExists) {
      return toast.error(`Receita "${name}" já existe!`);
    }
    localRecipeList.recipe.append(openCategory, name);
    closeModal();
  }

  function handleConfirmEditRecipe() {
    localRecipeList.recipe.edit(openCategory, openRecipe, name);
    closeModal();
  }

  function handleConfirmEditCategory() {
    localRecipeList.category.edit(openCategory, name);
    closeModal();
  }

  function handleConfirmDeleteCategory() {
    localRecipeList.category.remove(openCategory, name);
    closeModal();
  }

  function handleConfirmDeleteRecipe() {
    localRecipeList.recipe.remove(openCategory, name);
    closeModal();
  }

  function handleConfirm() {
    if (openRecipe) {
      if (openDialog === "edit") return handleConfirmEditRecipe();
      if (openDialog === "delete") return handleConfirmDeleteRecipe();
    } else {
      if (openDialog === "add") return handleConfirmNewRecipe();
      if (openDialog === "edit") return handleConfirmEditCategory();
      if (openDialog === "delete") return handleConfirmDeleteCategory();
    }
    return handleConfirmNewRecipe();
  }

  function getDialogConfirmText() {
    if (openDialog === "add") return "Adicionar";
    if (openDialog === "edit") return `Editar`;
    if (openDialog === "delete") return "Deletar";
    return "";
  }

  function getDialogTitle() {
    if (openRecipe) {
      if (openDialog === "edit") return `Edição da receita`;
    }
    if (openDialog === "add") return `Nova receita de ${openCategory}`;
    if (openDialog === "edit") return `Edição da categoria`;
    if (openDialog === "delete") return `Deleção`;
    return "";
  }

  function getDialogPlaceholder() {
    if (openRecipe) {
      if (openDialog === "edit") return `Edição da receita`;
    }
    if (openDialog === "edit") return "Edite a categoria";
    return "Nome da nova receita";
  }

  return (
    <>
      {recipeList?.map((category) => {
        return (
          <Accordion sx={{ width: "100%" }}>
            <AccordionSummary>
              <Stack
                onClick={(e) => {
                  if (!category.recipes.length) e.stopPropagation();
                }}
                sx={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Box display={"flex"} alignItems={"center"}>
                  <Box
                    sx={{
                      backgroundColor: "primary.main",
                      color: "secondary.main",
                    }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width={20}
                    height={20}
                    borderRadius="50%"
                    fontWeight={700}
                    marginRight={1}
                  >
                    {category.recipes.length}
                  </Box>
                  <Typography>{category?.category}</Typography>
                </Box>
                <Box>
                  <IconButton
                    edge="end"
                    aria-label="add"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickOpen(category.category);
                      setOpenDialog("add");
                    }}
                  >
                    <AddCircleIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickOpen(category.category);
                      setOpenDialog("edit");
                      setName(category.category);
                    }}
                  >
                    <EditIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickOpen(category.category);
                      setOpenDialog("delete");
                      setName(category.category);
                    }}
                  >
                    <DeleteIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                </Box>
              </Stack>
            </AccordionSummary>
            {category.recipes.map((recipe) => (
              <AccordionDetails key={recipe.name}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Link
                      href={`receitas/${category.category}/${recipe.name}`}
                      style={{ color: "#CCC" }}
                    >
                      {recipe.name}
                    </Link>
                  </Box>
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCategory(category.category);
                        setOpenRecipe(recipe.name);
                        setOpenDialog("edit");
                        setName(recipe.name);
                      }}
                    >
                      <EditIcon sx={{ color: "primary.main" }} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCategory(category.category);
                        setOpenRecipe(recipe.name);
                        setOpenDialog("delete");
                        setName(recipe.name);
                      }}
                    >
                      <DeleteIcon sx={{ color: "primary.main" }} />
                    </IconButton>
                  </Box>
                </Box>
              </AccordionDetails>
            ))}
          </Accordion>
        );
      })}
      <RecipeDialog
        title={getDialogTitle()}
        closeModal={closeModal}
        isOpen={!!openDialog}
        handleConfirm={handleConfirm}
        confirmText={getDialogConfirmText()}
        disableConfirm={!name}
      >
        {openDialog === "delete" ? (
          `Deseja deletar a ${openRecipe ? "receita" : "categoria"} ${name}?`
        ) : (
          <TextField
            autoFocus
            margin="dense"
            label={getDialogPlaceholder()}
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
      </RecipeDialog>
    </>
  );
}
