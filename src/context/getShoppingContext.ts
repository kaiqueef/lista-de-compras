import { useContext } from "react";
import { ShoppingListContext } from "./shoppingListContext";

export default function getShoppingContext() {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error(
      "useShoppingListContext must be used within a ShoppingListProvider"
    );
  }
  return context;
}
