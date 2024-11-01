import useRestaurantType from "@/hooks/types/useRestaurantType.type";
import useRestaurant from "@/hooks/useRestaurant.hook";
import { createContext, ReactNode } from "react";

const RestaurantContext = createContext<useRestaurantType | undefined>(undefined);

const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const RestaurantList = useRestaurant();

  return (
    <RestaurantContext.Provider value={RestaurantList}>
      {children}
    </RestaurantContext.Provider>
  );
};

export { RestaurantProvider, RestaurantContext };
