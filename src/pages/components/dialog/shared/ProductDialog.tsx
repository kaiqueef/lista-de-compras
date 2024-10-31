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
  return (
    <Dialog open={isOpen} onClose={closeModal} sx={{ height: "100vh" }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>

      <DialogActions>
        <Button onClick={closeModal}>Cancelar</Button>
        <Button onClick={handleConfirm} disabled={disableConfirm}>
          {isEditable ? "Atualizar" : "Adicionar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
