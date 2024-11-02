import { useContext } from "react";
import { RankingContext } from "./rankingContext";

export default function getRankingContext() {
  const context = useContext(RankingContext);
  if (context === undefined) {
    throw new Error(
      "useRankingContext must be used within a RankingProvider"
    );
  }
  return context;
}
