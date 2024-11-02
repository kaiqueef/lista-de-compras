import { Box, Button } from "@mui/material";
import getRankingContext from "@/context/getRankingContext";

export function AddRankingsCategoryButton() {
  //TODO:: JOIN ALL "ADD" BUTTONS
  const { rankingsPage } = getRankingContext();

  return (
    <Box sx={{ width: "100%", display: "flex" }}>
      <Button
        variant="outlined"
        onClick={rankingsPage.buttons.category.add}
        sx={{ width: "100%", m: 2 }}
      >
        Adicionar Categoria
      </Button>
    </Box>
  );
}
