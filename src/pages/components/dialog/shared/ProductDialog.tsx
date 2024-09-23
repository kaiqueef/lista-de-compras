import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Product } from "../../../../types/Product.type";
import getShoppingContext from "@/context/getShoppingContext";
import useIsClient from "@/hooks/useIsClient";

export default function ProductDialog({
  title,
  closeModal,
  isOpen,
  handleConfirm,
  disableConfirm,
  children,
}: {
  title: string;
  closeModal: () => void;
  isOpen: boolean;
  handleConfirm: () => void;
  disableConfirm: boolean;
  children: any;
}) {
  const isClient = useIsClient(); //TODO:: IMPROVE THIS CODE
  if (!isClient) {
    return null;
  }
  const { openEdit } = getShoppingContext();
  const isEditable = !!openEdit;
  const editProduct = openEdit as Product;
  const [name, setName] = useState("");
  const [priority, setPriority] = useState(false);
  const [renovalInDays, setRenovalInDays] = useState("");

  useEffect(() => {
    if (isEditable) {
      setName(editProduct?.name);
      setPriority(!!editProduct?.priority);
      setRenovalInDays(`${editProduct.renovalInDays}`);
    }
  }, [editProduct]);

  //TODO:: CONSEGUIR VER QUANDO FOI A ULTIMA VEZ QUE COMPROU PARA ATUALIZAR A FREQUENCIA DE COMPRA
  return (
    <Dialog open={isOpen} onClose={closeModal}>
      {/* <Dialog open={!!openEdit} onClose={closeModal}> */}
      <DialogTitle>
        {/* {isEditable ? "Edite o produto" : "Adicione um novo item"}{" "} */}
        {title}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>

      <DialogActions>
        <Button onClick={closeModal}>Cancelar</Button>
        <Button onClick={handleConfirm} disabled={disableConfirm}>
          {/* <Button onClick={handleAdd} disabled={!renovalInDays || !name}> */}
          {isEditable ? "Atualizar" : "Adicionar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
