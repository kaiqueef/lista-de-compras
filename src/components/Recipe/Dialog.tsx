import getRecipeContext from "@/context/getRecipeContext";
import { TextField } from "@mui/material";
import { RecipeDialog } from "../Dialog/shared";

export function Dialog() {
  const { dialog } = getRecipeContext();
  return (
    <RecipeDialog
      title={dialog.title}
      closeModal={dialog.close}
      isOpen={dialog.open}
      handleConfirm={dialog.confirm}
      confirmText={dialog.confirmButtonText}
      disableConfirm={dialog.disabled}
    >
      {dialog.deleteText || (
        <TextField
          autoFocus
          margin="dense"
          label={dialog.placeholder}
          type="text"
          fullWidth
          value={dialog.value}
          onChange={dialog.onChange}
        />
      )}
    </RecipeDialog>
  );
}
