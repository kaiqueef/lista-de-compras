import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import ProductDialog from "./shared/ProductDialog";
import { useState } from "react";
import getShoppingContext from "@/context/getShoppingContext";
import { Product } from "@/types/Product.type";
import useIsClient from "@/hooks/useIsClient";

export default function EditProduct() {
  const isClient = useIsClient(); //TODO:: IMPROVE THIS CODE
  if (!isClient) {
    return null;
  }
  const {
    openEdit,
    setNewProduct,
    setOpenDialogType,
    closeModal,
    localProductList,
  } = getShoppingContext();
  const [name, setName] = useState("");
  const [priority, setPriority] = useState(false);
  const [renovalInDays, setRenovalInDays] = useState("");

  function handleConfirm() {
    const newProduct: Product = {
      name,
      lastBuy: null,
      priority,
      renovalInDays: Number(renovalInDays),
    };
    if (!openEdit) return;
    localProductList.edit("lista", openEdit, newProduct);
    setName("");
    setRenovalInDays("");
    setPriority(false);
    closeModal();
    setNewProduct(newProduct);
    setOpenDialogType(null);
  }

  return (
    <>
      <ProductDialog
        title="Edite o produto"
        closeModal={closeModal}
        isOpen={!!openEdit}
        handleConfirm={handleConfirm}
        disableConfirm={!renovalInDays || !name}
      >
        <TextField
          autoFocus
          margin="dense"
          label="Nome do produto"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Frequencia de compra (dias)" // TODO:: SE NÃO QUISER, PODE DEIXAR VALOR GIGANTE (COLOCAR FLAG?)
          type="number"
          fullWidth
          value={renovalInDays}
          onChange={(e) => setRenovalInDays(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={priority}
              onChange={(e) => setPriority(e.target.checked)}
            />
          }
          label="Prioritário"
        />
      </ProductDialog>
    </>
  );
}
