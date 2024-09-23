import useShoppingListType from "@/hooks/types/useShoppingListType.type";
import useShoppingList from "@/hooks/useShoppingList.hook";
import { createContext, ReactNode } from "react";

const ShoppingListContext = createContext<useShoppingListType | undefined>(undefined);

const ShoppingListProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const shoppingList = useShoppingList();

  return (
    <ShoppingListContext.Provider value={shoppingList}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export { ShoppingListProvider, ShoppingListContext };
