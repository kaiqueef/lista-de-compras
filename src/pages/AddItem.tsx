import { Button } from "@mui/material";
import { useState } from "react";
import ProductDialog from "./ProductDialog";

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
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Adicionar Item
      </Button>
      <ProductDialog
        setNewProduct={setNewProduct}
        open={open}
        closeModal={() => setOpen(false)}
      />
    </div>
  );
};

export default AddItem;
