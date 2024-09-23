import { Box, Button } from "@mui/material";
import getShoppingContext from "@/context/getShoppingContext";
import AddNewProduct from "../dialog/AddNewProduct";
import useIsClient from "@/hooks/useIsClient";

const AddItem = () => {
  const isClient = useIsClient();
  if (!isClient) {
    return null;
  }

  const { setOpenDialogType } = getShoppingContext();

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
        Adicionar Item
      </Button>
      <AddNewProduct />
    </Box>
  );
};

export default AddItem;
