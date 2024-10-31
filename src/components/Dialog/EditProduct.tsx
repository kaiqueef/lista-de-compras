import {
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import getShoppingContext from "@/context/getShoppingContext";
import { Product } from "@/types/Product.type";
import { ProductDialog } from "./shared";

export function EditProduct() {
  const {
    openEdit,
    setNewProduct,
    setOpenDialogType,
    openDialogType,
    closeModal,
    localProductList,
  } = getShoppingContext();
  const [name, setName] = useState(openEdit?.name ?? "");
  const [priority, setPriority] = useState(openEdit?.priority);
  const [renovalInDays, setRenovalInDays] = useState(
    openEdit?.renovalInDays ?? ""
  );

  function handleConfirm() {
    const newProduct: Product = {
      name,
      lastBuy: openEdit?.lastBuy ?? null,
      priority,
      renovalInDays: Number(renovalInDays),
    };
    if (!openEdit) return;
    localProductList.edit("lista", openEdit, newProduct);
    localProductList.updateRemoteList();
    setName("");
    setRenovalInDays("");
    setPriority(false);
    closeModal();
    setNewProduct(newProduct);
    setOpenDialogType(null);
  }

  function formatToDDMMYYYY(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    setName(openEdit?.name ?? "");
    setPriority(openEdit?.priority);
    setRenovalInDays(openEdit?.renovalInDays ?? "");
  }, [openEdit]);

  return (
    <ProductDialog
      title="Edite o produto"
      closeModal={closeModal}
      isOpen={openDialogType === "edit"}
      handleConfirm={handleConfirm}
      disableConfirm={!renovalInDays || !name}
    >
      {openEdit?.lastBuy && (
        <Typography sx={{ fontSize: 14, mb: 2 }}>
          Data da última compra: <b>{formatToDDMMYYYY(openEdit?.lastBuy)}</b>
        </Typography>
      )}
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
  );
}
