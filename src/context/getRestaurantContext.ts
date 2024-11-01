import { useContext } from "react";
import { RestaurantContext } from "./restaurantContext";

export default function getRestaurantContext() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error(
      "useRestaurantContext must be used within a RestaurantProvider"
    );
  }
  return context;
}
