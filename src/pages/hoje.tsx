import AddItem from "../components/Buttons/AddItem";
import EditProduct from "../components/Dialog/EditProduct";
import NavBar from "../components/NavBar/NavBar";
import ShoppingList from "../components/ShoppingList/ShoppingList";

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
