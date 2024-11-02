import { useEffect } from "react";
import getShoppingContext from "@/context/getShoppingContext";
import { AddItem, EditProduct, NavBar, ShoppingList } from "@/components";

export default function Page() {
  const { loadRemoteList, today } = getShoppingContext();
  useEffect(() => {
    loadRemoteList();
  }, []);

  return (
    <>
      <NavBar title={today ? "Lista de Hoje" : "Lista de Compras"} />
      <AddItem />
      <ShoppingList hoje={today} />
      <EditProduct />
    </>
  );
}
