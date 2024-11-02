import useRankingType from "@/hooks/types/useRankingType.type";
import useRanking from "@/hooks/useRanking.hook";
import { createContext, ReactNode } from "react";

const RankingContext = createContext<useRankingType | undefined>(undefined);

const RankingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const RankingList = useRanking();

  return (
    <RankingContext.Provider value={RankingList}>
      {children}
    </RankingContext.Provider>
  );
};

export { RankingProvider, RankingContext };
