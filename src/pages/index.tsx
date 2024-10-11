import ShoppingList from "./components/ShoppingList/ShoppingList";
import AddItem from "./components/buttons/AddItem";
import EditProduct from "./components/dialog/EditProduct";
import NavBar from "./components/NavBar/NavBar";
import { useEffect } from "react";
import getShoppingContext from "@/context/getShoppingContext";

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
