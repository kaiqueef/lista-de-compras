import useRecipeType from "@/hooks/types/useRecipeType.type";
import useRecipe from "@/hooks/useRecipe.hook";
import { createContext, ReactNode } from "react";

const RecipeContext = createContext<useRecipeType | undefined>(undefined);

const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const RecipeList = useRecipe();

  return (
    <RecipeContext.Provider value={RecipeList}>
      {children}
    </RecipeContext.Provider>
  );
};

export { RecipeProvider, RecipeContext };
