import { useEffect } from "react";
import getShoppingContext from "@/context/getShoppingContext";
import { AddItem, EditProduct, ShoppingList } from "@/components";

export function Shopping() {
  const { loadRemoteList, today } = getShoppingContext();
  useEffect(() => {
    loadRemoteList();
  }, []);

  return (
    <>
      <AddItem />
      <ShoppingList hoje={today} />
      <EditProduct />
    </>
  );
}
