import ShoppingList from "./components/ShoppingList/ShoppingList";
import AddItem from "./components/buttons/AddItem";
import EditProduct from "./components/dialog/EditProduct";
import NavBar from "./components/NavBar/NavBar";

export default function Page() {
  return (
    <>
      <NavBar />
      <ShoppingList />
      <EditProduct />
      <AddItem />
    </>
  );
}
