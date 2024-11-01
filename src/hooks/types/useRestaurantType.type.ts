import { Restaurant, Restaurants } from "@/types/Restaurant.type";

type useRestaurantType = {
  restaurantsPage: RestaurantsPage;
  dialog: DialogProps;
};

export default useRestaurantType;

export interface RestaurantCategory {
  category: string;
}
export interface RestaurantsPage {
  list: Restaurants[];
  buttons: {
    category: {
      add: () => void;
      edit: (e: any, categoryName: string) => void;
      delete: (e: any, categoryName: string) => void;
    };
    restaurant: {
      add: (e: any, category: string) => void;
      edit: (
        e: any,
        category: string,
        restaurantName: string,
        stars: number
      ) => void;
      delete: (e: any, category: string, restaurantName: string) => void;
    };
  };
}

interface DialogProps {
  title: string;
  subtitle: string | null;
  close: () => void;
  open: boolean;
  confirm: () => void;
  confirmButtonText: string;
  disabled: boolean;
  placeholder: string;
  value: {
    name: string;
    stars: number | "";
  };
  onChange: {
    name: (e: any) => void;
    stars: {
      text: (e: any) => void;
      click: (e: any, index: number) => void;
    };
  };
  deleteText: string;
  type: "delete" | "restaurant" | "category" | "edit-restaurant-score";
}

export type openDialogType = "add" | "edit" | "delete";
