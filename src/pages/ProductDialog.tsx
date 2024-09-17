import { useLocalStorage } from "@/hooks/useLocalStorage.hook";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function ProductDialog({
  setNewProduct,
  open,
  closeModal,
  editProduct,
}: {
  setNewProduct: (product: Product) => void;
  open: boolean;
  closeModal: () => void;
  editProduct?: Product | null;
}) {
  const isEditable = !!editProduct;
  const { localProduct } = useLocalStorage();
  const [name, setName] = useState("");
  const [priority, setPriority] = useState(false);
  const [renovalInDays, setRenovalInDays] = useState("");

  const handleAdd = () => {
    const newProduct: Product = {
      name,
      lastBuy: null,
      priority,
      renovalInDays: Number(renovalInDays),
    };
    if (isEditable) localProduct.edit("lista", editProduct, newProduct);
    else localProduct.append("lista", newProduct);
    setName("");
    setRenovalInDays("");
    setPriority(false);
    closeModal();
    setNewProduct(newProduct);
  };

  useEffect(() => {
    if (isEditable) {
      setName(editProduct?.name);
      setPriority(!!editProduct?.priority);
      setRenovalInDays(`${editProduct.renovalInDays}`);
    }
  }, [editProduct]);

  return (
    <Dialog open={open} onClose={closeModal}>
      <DialogTitle>
        {isEditable ? "Edite o produto" : "Adicione um novo item"}{" "}
      </DialogTitle>
      <DialogContent>
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
          label="Frequencia de compra (dias)"
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
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Cancelar</Button>
        <Button onClick={handleAdd} disabled={!renovalInDays || !name}>
          {isEditable ? "Atualizar" : "Adicionar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
