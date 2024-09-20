import { useLocalStorage } from "@/hooks/useLocalStorage.hook";
import { Box, Button, Typography } from "@mui/material";
import ShoppingList from "./ShoppingList";
import AddItem from "./AddItem";
import { useEffect, useState } from "react";
import { Product } from "../types/Product.type";
import { RemoteStorage } from "remote-storage";

export default function Page() {
  //TODO:: CHECK IF THERE IS A REMOTE LIST?
  const [_newProduct, setNewProduct] = useState<Product>();
  const remoteStorage = new RemoteStorage({ userId: "kaique" }); //TODO:: CHECAR SE EXISTE USERID NO LOCALSTORAGE
  //TODO:: DEIXAR USUÁRIO COLOCAR SEU USERID

  const { get, set } = useLocalStorage();

  async function saveValues() {
    const list: Product[] | null = get("lista");
    await remoteStorage.setItem("lista", list);
  }

  async function loadList() {
    const remoteList = (await remoteStorage.getItem("lista")) as Product[];
    if (remoteList) set("lista", remoteList);
  }

  return (
    <>
      <Typography variant="h4" component={"h1"} textAlign={"center"}>
        Lista de Compras
      </Typography>
      <ShoppingList setNewProduct={setNewProduct} />
      <AddItem setNewProduct={setNewProduct} />
      <Button onClick={saveValues}>Salvar lista</Button>
      <Button onClick={loadList}>Carregar lista</Button>
    </>
  );
}
