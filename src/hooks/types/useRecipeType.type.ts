import { Product } from "@/types/Product.type";
import { Recipe } from "@/types/Recipe.type";

type useRecipeType = {
  recipePage: RecipePage;
  recipesPage: RecipesPage;
  dialog: DialogProps;
};

export default useRecipeType;

export interface RecipePage {
  setProps: ({
    category,
    recipe,
  }: {
    category: string;
    recipe: string;
  }) => void;
  product: {
    list: (category: string, recipe: string) => Product[];
    onToggle: (
      category: string,
      recipeName: string,
      productName: string,
      deleteLastBuy?: boolean
    ) => void;
  };
  buttons: {
    add: () => void;
    edit: (e: any, productName: string) => void;
    delete: (e: any, productName: string) => void;
  };
}
export interface RecipesPage {
  list: Recipe[] | null;
  buttons: {
    category: {
      add: () => void;
      edit: (e: any, categoryName: string) => void;
      delete: (e: any, categoryName: string) => void;
    };
    recipe: {
      add: (e: any, category: string) => void;
      edit: (e: any, category: string, recipeName: string) => void;
      delete: (e: any, category: string, recipeName: string) => void;
    };
  };
}

interface DialogProps {
  title: string;
  close: () => void;
  open: boolean;
  confirm: () => void;
  confirmButtonText: string;
  disabled: boolean;
  placeholder: string;
  value: string;
  onChange: (e: any) => void;
  deleteText: string;
}

export type openDialogType = "add" | "edit" | "delete";
