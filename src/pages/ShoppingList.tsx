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
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ProductDialog from "./ProductDialog";
import { Product } from "../types/Product.type";
import { RemoteStorage } from "remote-storage";

function ShoppingList({
  setNewProduct,
}: {
  setNewProduct: (product: Product) => void;
}) {
  const { get, localProduct } = useLocalStorage();

  const remoteStorage = new RemoteStorage({ userId: "kaique" }); //TODO:: CHECAR SE EXISTE USERID NO LOCALSTORAGE
  let list: Product[] | null = get("lista");
  if (!list) return;

  async function getList() {
    const remoteList = (await remoteStorage.getItem("lista")) as Product[];
    if (remoteList) list = remoteList;
  }

  useEffect(() => {
    getList();
  }, []);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState<Product | null>(null);
  const [itemToDelete, setItemToDelete] = useState("");

  const handleToggle = (product: Product) => {
    localProduct.updateLastBuy("lista", product, isChecked(product));
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
    localProduct.remove("lista", itemToDelete);
    handleClose();
  };

  const isChecked = (product: Product) =>
    !(
      !product.lastBuy ||
      isDifferenceGreaterThan(product.lastBuy, product.renovalInDays)
    );

  const sortedList = list.sort((a, b) => {
    if (isChecked(a) === isChecked(b)) {
      if (a.priority === b.priority) {
        return a.name.localeCompare(b.name);
      }
      return a.priority ? -1 : 1;
    }
    return isChecked(a) ? 1 : -1;
  });
  //TODO:: ADD TOAST WHEN DELETING ITEM

  function isDifferenceGreaterThan(
    date: string | null,
    numberOfDays: number
  ): boolean {
    if (!date) return false;
    const inputDate = new Date(date);
    const currentDate = new Date();
    const timeDifference = Math.abs(
      currentDate.getTime() - inputDate.getTime()
    );
    const dayDifference = timeDifference / (1000 * 3600 * 24);
    return dayDifference > numberOfDays;
  }

  return (
    <>
      <List>
        {sortedList.map((product) => {
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
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => setOpenEdit(product)}
                >
                  <EditIcon sx={{ color: "#AAA" }} />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteClick(product.name)}
                >
                  <DeleteIcon sx={{ color: "#AAA" }} />
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
      <ProductDialog
        setNewProduct={setNewProduct}
        open={!!openEdit}
        closeModal={() => setOpenEdit(null)}
        editProduct={openEdit}
      />
    </>
  );
}

export default ShoppingList;
