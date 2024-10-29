import { Recipe } from "@/types/Recipe.type";

type useRecipeType = {
  recipeList: Recipe[] | null;
  openDialogType: "add" | "edit" | string | null;
  setOpenDialogType: React.Dispatch<
    React.SetStateAction<"add" | "edit" | string | null>
  >;
  closeModal: () => void;
  localRecipeList: any;
};

export default useRecipeType;
