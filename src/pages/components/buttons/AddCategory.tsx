import { Box, Button } from "@mui/material";
import AddNewCategory from "../dialog/AddNewCategory";
import getRecipeContext from "@/context/getRecipeContext";

const AddCategory = () => {
  const { setOpenDialogType } = getRecipeContext();

  const handleClickOpen = () => {
    setOpenDialogType("add");
  };

  return (
    <Box sx={{ width: "100%", display: "flex" }}>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{ width: "100%", m: 2 }}
      >
        Adicionar Categoria
      </Button>
      <AddNewCategory />
    </Box>
  );
};

export default AddCategory;
