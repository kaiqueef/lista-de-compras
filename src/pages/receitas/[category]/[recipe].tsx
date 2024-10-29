import NavBar from "@/pages/components/NavBar/NavBar";
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
import RecipeDialog from "@/pages/components/dialog/shared/RecipeDialog";
import { useState } from "react";
import getRecipeContext from "@/context/getRecipeContext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Product } from "@/types/Product.type";

const RecipePage = () => {
  const router = useRouter();
  const { category, recipe } = router.query;
  const { localRecipeList } = getRecipeContext();

  if (typeof category !== "string" || typeof recipe !== "string") {
    return <div>Invalid category or recipe</div>;
  }

  const [name, setName] = useState("");
  const [openDialog, setOpenDialog] = useState<
    "add" | "edit" | "delete" | null
  >(null);
  const [openItem, setOpenItem] = useState<string | null>(null);

  const isChecked = (product: Product) =>
    !(
      !product.lastBuy ||
      isDifferenceGreaterThan(product.lastBuy, product.renovalInDays)
    );

  function isDifferenceGreaterThan( //TODO:: PASS THIS TO UTILS.
    date: string | null,
    numberOfDays: number
  ): boolean {
    if (!date) return false;
    const inputDate = new Date(date);
    const currentDate = new Date();

    inputDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const timeDifference = Math.abs(
      currentDate.getTime() - inputDate.getTime()
    );
    const dayDifference = timeDifference / (1000 * 3600 * 24);
    return dayDifference > numberOfDays;
  }

  function getDialogTitle() {
    if (openDialog === "add") return `Adicionar ingrediente`;
    if (openDialog === "edit") return `Edição`;
    if (openDialog === "delete") return `Deleção`;
    return "";
  }

  //TODO:: PASS ALL THIS TO HOOK
  function closeModal() {
    setOpenDialog(null);
    setOpenItem(null);
    setName("");
  }

  function handleConfirmAdd() {
    localRecipeList.items.append(category, recipe, name);
    closeModal();
  }

  function handleConfirmEdit() {
    localRecipeList.items.edit(category, recipe, openItem, name);
    closeModal();
  }

  function handleConfirmRemove() {
    localRecipeList.items.remove(category, recipe, name);
    closeModal();
  }

  function handleConfirm() {
    if (openDialog === "add") return handleConfirmAdd();
    if (openDialog === "edit") return handleConfirmEdit();
    if (openDialog === "delete") return handleConfirmRemove();
    return "";
  }

  function getDialogConfirmText() {
    if (openDialog === "add") return "Adicionar";
    if (openDialog === "edit") return `Editar`;
    if (openDialog === "delete") return "Deletar";
    return "";
  }

  function getDialogPlaceholder() {
    if (openDialog === "edit") return "Edite a ingrediente";
    return "Nome do ingrediente";
  }

  const handleToggle = (product: Product) => {
    localRecipeList.items.updateLastBuy(
      category,
      recipe,
      product.name,
      isChecked(product)
    );
  };

  const shoppingList: Product[] = localRecipeList.items.list(category, recipe);
  if (!shoppingList) {
    router.push("/receitas");
    return null;
  }

  const sortedList = shoppingList.sort((a, b) => {
    if (isChecked(a) === isChecked(b)) {
      return a.name.localeCompare(b.name);
    }
    return isChecked(a) ? 1 : -1;
  });

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
            onClick={() => {
              setOpenDialog("add");
            }}
            sx={{ width: "100%", m: 2 }}
          >
            Adicionar ingrediente
          </Button>
        </Box>
        <List sx={{ width: "100%" }}>
          {sortedList.map((product: Product) => {
            return (
              <ListItem
                disablePadding
                style={{
                  textDecoration: isChecked(product) ? "line-through" : "none",
                  opacity: isChecked(product) ? 0.5 : 1,
                }}
                onClick={() => handleToggle(product)}
              >
                <ListItemButton>
                  <ListItemText primary={product.name} />
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDialog("edit");
                      setName(product.name);
                      setOpenItem(product.name);
                    }}
                  >
                    <EditIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDialog("delete");
                      setName(product.name);
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
        title={getDialogTitle()}
        closeModal={closeModal}
        isOpen={!!openDialog}
        handleConfirm={handleConfirm}
        confirmText={getDialogConfirmText()}
        disableConfirm={!name}
      >
        {openDialog === "delete" ? (
          `Deseja deletar o ingrediente ${name}?`
        ) : (
          <TextField
            autoFocus
            margin="dense"
            label={getDialogPlaceholder()}
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
      </RecipeDialog>
    </>
  );
};
export default RecipePage;
