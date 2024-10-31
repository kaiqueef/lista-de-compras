import NavBar from "@/components/NavBar/NavBar";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import { useRouter } from "next/router";
import { capitalizeString } from "@/utils/formatters";
import RecipeDialog from "@/components/dialog/shared/RecipeDialog";
import { useEffect } from "react";
import getRecipeContext from "@/context/getRecipeContext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Product } from "@/types/Product.type";
import { isChecked } from "@/utils/product";

const RecipePage = () => {
  const router = useRouter();
  const category = router.query.category as string;
  const recipe = router.query.recipe as string;
  const { recipePage, dialog } = getRecipeContext();

  if (typeof category !== "string" || typeof recipe !== "string") {
    return <div>Invalid category or recipe</div>;
  }

  const shoppingList = recipePage.product.list(category, recipe);
  if (!shoppingList) {
    router.push("/receitas");
    return null;
  }

  useEffect(() => {
    recipePage.setProps({
      category,
      recipe,
    });
  }, []);

  return (
    <>
      <NavBar
        title={`${capitalizeString(category)} - ${capitalizeString(recipe)}`}
        icon={<OutdoorGrillIcon style={{ fontSize: 70, color: "#CCC" }} />}
      />
      <Stack alignItems={"center"}>
        <Box sx={{ width: "100%", display: "flex" }}>
          <Button
            variant="outlined"
            onClick={recipePage.buttons.add}
            sx={{ width: "100%", m: 2 }}
          >
            Adicionar ingrediente
          </Button>
        </Box>
        <List sx={{ width: "100%" }}>
          {shoppingList.map((product: Product) => {
            return (
              <ListItem
                disablePadding
                style={{
                  textDecoration: isChecked(product) ? "line-through" : "none",
                  opacity: isChecked(product) ? 0.5 : 1,
                }}
                onClick={() => {
                  recipePage.product.onToggle(
                    category,
                    recipe,
                    product.name,
                    isChecked(product)
                  );
                }}
              >
                <ListItemButton>
                  <ListItemText primary={product.name} />
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={(e) => {
                      recipePage.buttons.edit(e, product.name);
                    }}
                  >
                    <EditIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      recipePage.buttons.delete(e, product.name);
                    }}
                  >
                    <DeleteIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Stack>

      <RecipeDialog
        title={dialog.title}
        closeModal={dialog.close}
        isOpen={!!dialog.open}
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
    </>
  );
};
export default RecipePage;