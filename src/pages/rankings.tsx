import { useEffect } from "react";
import getRecipeContext from "@/context/getRecipeContext";
import {
  AddRankingsCategoryButton,
  RankingDialog,
  RankingList,
} from "@/components";

export default function Receitas() {
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
