import { Box, Button } from "@mui/material";
import getRestaurantContext from "@/context/getRestaurantContext";

export function AddRestaurantsCategoryButton() {
  //TODO:: JOIN ALL "ADD" BUTTONS
  const { restaurantsPage } = getRestaurantContext();

  return (
    <Box sx={{ width: "100%", display: "flex" }}>
      <Button
        variant="outlined"
        onClick={restaurantsPage.buttons.category.add}
        sx={{ width: "100%", m: 2 }}
      >
        Adicionar Categoria
      </Button>
    </Box>
  );
}
