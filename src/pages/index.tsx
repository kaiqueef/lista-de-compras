import { useLocalStorage } from "@/hooks/useLocalStorage.hook";
import { Box, Typography } from "@mui/material";
import ShoppingList from "./ShoppingList";
import AddItem from "./AddItem";
import { useEffect, useState } from "react";
import { Product } from "../types/Product.type";

export default function Page() {
  //TODO:: CHECK IF THERE IS A LIST

  const [_newProduct, setNewProduct] = useState<Product>();

  return (
    <>
      <Typography variant="h2">Lista de Compras</Typography>
      <ShoppingList setNewProduct={setNewProduct} />
      <AddItem setNewProduct={setNewProduct} />
    </>
  );
}
