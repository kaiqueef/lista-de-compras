import {
  Button,
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export function Dialog({
  title,
  closeModal,
  isOpen,
  handleConfirm,
  confirmText,
  disableConfirm,
  children,
}: {
  title: string;
  closeModal: () => void;
  isOpen: boolean;
  handleConfirm: () => void;
  confirmText: string;
  disableConfirm: boolean;
  children: any;
}) {
  return (
    <MuiDialog open={isOpen} onClose={closeModal} sx={{ height: "100vh" }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>

      <DialogActions>
        <Button onClick={closeModal}>Cancelar</Button>
        <Button onClick={handleConfirm} disabled={disableConfirm}>
          {confirmText}
        </Button>
      </DialogActions>
    </MuiDialog>
  );
}
