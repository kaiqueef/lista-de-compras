import { useEffect } from "react";
import getRecipeContext from "@/context/getRecipeContext";
import {
  AddRankingsCategoryButton,
  RankingDialog,
  RankingList,
} from "@/components";

export function Rankings() {
  const { recipePage } = getRecipeContext();
  useEffect(() => {
    recipePage.setProps({
      category: "",
      recipe: "",
    });
  }, []);

  return (
    <>
      <AddRankingsCategoryButton />
      <RankingList />
      <RankingDialog />
    </>
  );
}
