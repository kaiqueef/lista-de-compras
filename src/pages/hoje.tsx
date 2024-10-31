import AddItem from "../components/buttons/AddItem";
import EditProduct from "../components/dialog/EditProduct";
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
