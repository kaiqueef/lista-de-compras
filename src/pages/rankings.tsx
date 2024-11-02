import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import { Stack } from "@mui/material";
import { useEffect } from "react";
import getRecipeContext from "@/context/getRecipeContext";
import {
  AddRankingsCategoryButton,
  NavBar,
  RankingDialog,
  RankingList,
} from "@/components";
import Image from "next/image";

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
      <NavBar
        title="Rankings"
        icon={
          <Image
            src="/icons/restaurant-icon.png"
            width={55}
            height={55}
            alt="icon"
          />
        }
      />
      <AddRankingsCategoryButton />
      <RankingList />
      <RankingDialog />
    </>
  );
}
