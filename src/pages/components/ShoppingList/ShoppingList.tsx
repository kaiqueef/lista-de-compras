import { useLocalStorage } from "@/hooks/useLocalStorage.hook";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Product } from "../../../types/Product.type";
import Favorite from "../buttons/Favorite";
import getShoppingContext from "@/context/getShoppingContext";

function ShoppingList({ hoje = false }) {
  const {
    shoppingList,
    setNewProduct,
    openEdit,
    setOpenEdit,
    localProductList,
  } = getShoppingContext();
  if (!shoppingList) return;

  const [open, setOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");

  const handleToggle = (product: Product) => {
    localProductList.updateLastBuy("lista", product, isChecked(product));
    setNewProduct(product);
  };

  const handleDeleteClick = (productName: string) => {
    setItemToDelete(productName);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setItemToDelete("");
  };

  const handleDeleteConfirm = () => {
    localProductList.remove("lista", itemToDelete);
    handleClose();
  };

  const isChecked = (product: Product) =>
    !(
      !product.lastBuy ||
      isDifferenceGreaterThan(product.lastBuy, product.renovalInDays)
    );

  const sortedList = shoppingList.sort((a, b) => {
    if (isChecked(a) === isChecked(b)) {
      if (a.priority === b.priority) {
        return a.name.localeCompare(b.name);
      }
      return a.priority ? -1 : 1;
    }
    return isChecked(a) ? 1 : -1;
  });

  const currentDate = new Date().toISOString().split("T")[0];
  let list;

  if (hoje) {
    const filteredList = sortedList.filter(
      (item) =>
        !isChecked(item) ||
        item.lastBuy === null ||
        item.lastBuy.split("T")[0] === currentDate
    );
    list = filteredList;
  } else {
    list = sortedList;
  }

  //TODO:: ADD TOAST WHEN DELETING ITEM

  function isDifferenceGreaterThan(
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

  return (
    <>
      <List>
        {list.map((product) => {
          return (
            <ListItem
              disablePadding
              style={{
                textDecoration: isChecked(product) ? "line-through" : "none",
                opacity: isChecked(product) ? 0.5 : 1,
              }}
            >
              <ListItemButton>
                <ListItemText
                  onClick={() => handleToggle(product)}
                  primary={product.name}
                />
                <Favorite product={product} />
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => setOpenEdit(product)}
                >
                  <EditIcon sx={{ color: "primary.main" }} />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteClick(product.name)}
                >
                  <DeleteIcon sx={{ color: "primary.main" }} />
                </IconButton>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Deleção"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja deletar o item {itemToDelete}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ShoppingList;
