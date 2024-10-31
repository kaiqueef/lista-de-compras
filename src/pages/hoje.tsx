import { AddItem, EditProduct, NavBar, ShoppingList } from "@/components";

export default function Hoje() {
  return (
    <>
      <NavBar title="Lista de Hoje" />
      <ShoppingList hoje />
      <EditProduct />
      <AddItem />
    </>
  );
}
