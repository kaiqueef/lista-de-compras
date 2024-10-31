import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useState } from "react";
import getShoppingContext from "@/context/getShoppingContext";
import { Product } from "@/types/Product.type";
import { ProductDialog } from "./shared";

export function AddNewProduct() {
  const {
    setOpenDialogType,
    openDialogType,
    closeModal,
    setNewProduct,
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
    localProductList.append("lista", newProduct);
    localProductList.updateRemoteList();
    setName("");
    setRenovalInDays("");
    setPriority(false);
    closeModal();
    setNewProduct(newProduct);
    setOpenDialogType(null);
  }

  return (
    <ProductDialog
      title="Adicionar um produto"
      closeModal={() => setOpenDialogType(null)}
      isOpen={openDialogType === "add"}
      handleConfirm={handleConfirm}
      disableConfirm={!renovalInDays || !name}
    >
      <TextField
        autoFocus
        margin="dense"
        label="Adicione um novo item"
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
  );
}
