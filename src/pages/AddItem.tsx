import { Box, Button } from "@mui/material";
import { useState } from "react";
import ProductDialog from "./ProductDialog";
import { Product } from "../types/Product.type";

const AddItem = ({
  setNewProduct,
}: {
  setNewProduct: (product: Product) => void;
}) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <Box sx={{width: '100%', display: 'flex'}}>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{ width: "100%", m: 2 }}
      >
        Adicionar Item
      </Button>
      <ProductDialog
        setNewProduct={setNewProduct}
        open={open}
        closeModal={() => setOpen(false)}
      />
    </Box>
  );
};

export default AddItem;
