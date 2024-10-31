import { Box, Button } from "@mui/material";
import getRecipeContext from "@/context/getRecipeContext";

export function AddCategoryButton() {
  const { recipesPage } = getRecipeContext();

  return (
    <Box sx={{ width: "100%", display: "flex" }}>
      <Button
        variant="outlined"
        onClick={recipesPage.buttons.category.add}
        sx={{ width: "100%", m: 2 }}
      >
        Adicionar Categoria
      </Button>
    </Box>
  );
}
