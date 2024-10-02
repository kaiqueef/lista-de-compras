import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
} from "@mui/material";
import getShoppingContext from "@/context/getShoppingContext";

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
  const { openEdit } = getShoppingContext();
  const isEditable = !!openEdit;
  //TODO:: CONSEGUIR VER QUANDO FOI A ULTIMA VEZ QUE COMPROU PARA ATUALIZAR A FREQUENCIA DE COMPRA
  return (
    <Dialog open={isOpen} onClose={closeModal} sx={{ height: "100vh" }}>
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
