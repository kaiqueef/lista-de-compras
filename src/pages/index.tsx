import { useEffect } from "react";
import getShoppingContext from "@/context/getShoppingContext";
import { AddItem, EditProduct, NavBar, ShoppingList } from "@/components";

export default function Page() {
  const { loadRemoteList } = getShoppingContext();
  useEffect(() => {
    loadRemoteList();
  }, []);

  return (
    <>
      <NavBar />
      <AddItem />
      <ShoppingList />
      <EditProduct />
    </>
  );
}
