import { Ranking, Rankings } from "@/types/Ranking.type";

type useRankingType = {
  rankingsPage: RankingsPage;
  dialog: DialogProps;
};

export default useRankingType;

export interface RankingCategory {
  category: string;
}
export interface RankingsPage {
  list: Rankings[];
  buttons: {
    category: {
      add: () => void;
      edit: (e: any, categoryName: string) => void;
      delete: (e: any, categoryName: string) => void;
    };
    ranking: {
      add: (e: any, category: string) => void;
      edit: (
        e: any,
        category: string,
        rankingName: string,
        stars: number
      ) => void;
      delete: (e: any, category: string, rankingName: string) => void;
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
  type: "delete" | "ranking" | "category" | "edit-ranking-score";
}

export type openDialogType = "add" | "edit" | "delete";
