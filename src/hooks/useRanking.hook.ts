import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage.hook";
import { RemoteStorage } from "remote-storage";
import { toast } from "react-toastify";
import useRankingType, {
  openDialogType,
} from "./types/useRankingType.type";
import { compareStrings } from "@/utils/compareStrings";
import { Rankings } from "@/types/Ranking.type";

const useRanking = (): useRankingType => {
  const { get, set } = useLocalStorage();
  const listName = "rankings";
  const remoteList = get("lista-remota");
  const remoteStorage = new RemoteStorage({ userId: remoteList });

  const containsList = get(listName);
  if (!containsList) loadRemoteList();

  const [rankingList, setRankingList] = useState<Rankings[]>(
    get(listName)
  );
  const [name, setName] = useState("");
  const [stars, setStars] = useState<number | "">("");
  const [openDialog, setOpenDialog] = useState<openDialogType | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openRanking, setOpenRanking] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);

  async function loadRemoteList() {
    const remoteList = (await remoteStorage.getItem(listName)) as Rankings[];
    if (remoteList) {
      set(listName, remoteList);
      setRankingList(remoteList);
    }
  }

  async function updateRemoteList() {
    if (remoteList) {
      try {
        const remoteStorage = new RemoteStorage({ userId: remoteList });
        await remoteStorage.setItem(listName, get(listName));
        toast.success("Lista atualizada!");
      } catch {
        toast.error("Erro ao atualizar lista remota");
      }
    }
  }

  async function setNewRankingList(key: string, newList: Rankings[]) {
    newList.sort((a, b) => {
      return a.category.localeCompare(b.category);
    });
    newList.forEach((category) => {
      category.rankings.sort((a, b) => {
        return b.stars - a.stars;
      });
    });

    set(key, newList);

    setRankingList(newList);
    if (remoteList) {
      const remoteStorage = new RemoteStorage({ userId: remoteList }); //TODO:: CHECAR ISSO
      await remoteStorage.setItem(listName, newList);
      updateRemoteList();
    }
  }

  const exists = {
    category: () =>
      rankingList?.some((ranking) =>
        compareStrings(ranking.category, name)
      ),
    ranking: (category: string, caseSensitive = true) => {
      const ranking = rankingList?.find((item) =>
        compareStrings(item.category, category)
      )?.rankings;
      return ranking?.some((ranking) =>
        caseSensitive
          ? compareStrings(ranking.name, name)
          : ranking.name.trim() === name
      );
    },
  };

  const add = {
    category: () => {
      if (exists.category()) {
        throw new Error(`Categoria "${name}" já existe!`);
      }
      const newCategory: Rankings = {
        category: name,
        rankings: [],
      };
      const item = get(listName);
      const newItem = item ? [...item, newCategory] : [newCategory];
      setNewRankingList(listName, newItem);
    },
    ranking: () => {
      const category = openCategory;
      if (!category) return;
      if (exists.ranking(category)) {
        throw new Error(`Rankinge "${name}" já existe!`);
      }
      const items: Rankings[] = get(listName);
      const _category = items.find((item) =>
        compareStrings(item.category, category)
      );
      _category?.rankings.push({ name, stars: Number(stars) });
      setNewRankingList(listName, items);
    },
  };

  const edit = {
    category: () => {
      const oldCategoryName = openCategory;
      if (!oldCategoryName) return;
      if (exists.category()) {
        throw new Error(`Categoria "${name}" já existe!`);
      }
      const newCategoryName = name;
      const items: Rankings[] = get(listName);
      const newRankings = items.map((item) => {
        if (compareStrings(item.category, oldCategoryName))
          return { ...item, category: newCategoryName };
        return item;
      });
      setNewRankingList(listName, newRankings);
    },
    ranking: () => {
      if (!openCategory || !openRanking) return;
      const category = openCategory;
      if (stars === "") {
        throw new Error("Insira uma nota válida!");
      }
      const oldRankingName = openRanking;
      const newRankingName = name;
      const items: Rankings[] = get(listName);
      const newRankings = items.map((item) => {
        if (compareStrings(item.category, category))
          return {
            category: item.category,
            rankings: item.rankings.map((ranking) => {
              if (compareStrings(ranking.name, oldRankingName))
                return { ...ranking, name: newRankingName, stars };
              return ranking;
            }),
          };
        return item;
      });
      setNewRankingList(listName, newRankings);
    },
  };

  const _delete = {
    category: () => {
      const categoryName = openCategory;
      if (!categoryName) return;
      const list: Rankings[] = get(listName);
      if (!list) return;
      const newList = list.filter(
        (product) => product.category !== categoryName
      );
      setNewRankingList(listName, newList);
    },
    ranking: () => {
      if (!openCategory) return;
      const category = openCategory;
      const rankingName = name;
      const list: Rankings[] = get(listName);
      if (!list) return;
      const newList = list.map((categoryitem) => {
        if (compareStrings(categoryitem.category, category)) {
          return {
            category: categoryitem.category,
            rankings: categoryitem.rankings.filter(
              (ranking) => ranking.name !== rankingName
            ),
          };
        }
        return categoryitem;
      });
      setNewRankingList(listName, newList);
    },
  };

  function closeModal() {
    setOpenDialog(null);
    setOpenItem(null);
    setName("");
    setStars("");
    setOpenCategory(null);
    setOpenRanking(null);
  }

  const handleConfirm = {
    category: {
      add: add.category,
      edit: edit.category,
      delete: _delete.category,
    },
    ranking: {
      add: add.ranking,
      edit: edit.ranking,
      delete: _delete.ranking,
    },
  };

  function getRankingOrCategory() {
    if (openRanking) return "ranking";
    return openCategory && openDialog === "add" ? "ranking" : "category";
  }

  function getHandleConfirm() {
    const level = getRankingOrCategory();
    try {
      handleConfirm[level][openDialog as openDialogType]();
      closeModal();
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    }
  }

  const _dialog = {
    placeholder: () => {
      const placeholders = () => {
        //TODO:: IMPROVE THIS
        if (openRanking) {
          if (openDialog === "edit") return `Nome do item`;
        }
        if (openDialog === "edit") return "Nome da categoria";
        if (!openCategory) return "Nome da nova categoria";
        return "Nome do novo item";
      };

      return placeholders();
    },
    confirmText: {
      add: "Adicionar",
      edit: "Editar",
      delete: "Deletar",
    },
    title: {
      category: {
        add: "Adicionar Categoria",
        edit: "Edição da categoria",
        delete: "Deletar",
      },
      ranking: {
        add: `Novo item`,
        edit: String(openRanking),
        delete: "Deletar",
      },
    },
    subtitle: {
      category: {
        add: "",
        edit: "",
        delete: "",
      },
      ranking: {
        add: openCategory,
        edit: openCategory,
        delete: "",
      },
    },
  };

  function openModal(props: {
    type: openDialogType;
    e?: any;
    category?: string;
    name?: string;
    stars?: number;
    rankingName?: string;
    openItem?: string;
  }) {
    const { type, e, category, name, rankingName, openItem, stars } = props;
    setOpenDialog(type);
    if (e) e.stopPropagation();
    if (category) setOpenCategory(category);
    if (name) setName(name);
    if (stars) setStars(stars);
    if (rankingName) setOpenRanking(rankingName);
    if (openItem) setOpenItem(openItem);
  }

  const buttons = {
    add: {
      category: () => openModal({ type: "add" }),
      ranking: (e: any, category: string) =>
        openModal({ type: "add", e, category }),
    },
    edit: {
      category: (e: any, category: string) =>
        openModal({ type: "edit", e, category, name: category }),
      ranking: (
        e: any,
        category: string,
        rankingName: string,
        stars: number
      ) => {
        openModal({
          type: "edit",
          e,
          category,
          rankingName,
          name: rankingName,
          stars,
        });
      },
    },
    delete: {
      category: (e: any, category: string) =>
        openModal({ type: "delete", e, category, name: category }),
      ranking: (e: any, category: string, rankingName: string) =>
        openModal({
          type: "delete",
          e,
          category,
          rankingName,
          name: rankingName,
        }),
      item: (e: any, productName: string) =>
        openModal({ type: "delete", e, name: productName }),
    },
  };

  function getDialogTitle() {
    const level = getRankingOrCategory();
    return _dialog.title[level][openDialog as openDialogType];
  }

  function getDialogSubTitle() {
    const level = getRankingOrCategory();
    return _dialog.subtitle[level][openDialog as openDialogType];
  }

  function getDialogOnDelete() {
    if (openDialog !== "delete") return "";
    const text = `Deseja deletar ${
      //TODO:: USE LEVEL
      openRanking ? "o ranking_rever" : "a categoria"
    } ${name}?`;

    return text;
  }

  const rankingsPage = {
    list: rankingList,
    buttons: {
      category: {
        add: buttons.add.category,
        edit: buttons.edit.category,
        delete: buttons.delete.category,
      },
      ranking: {
        add: buttons.add.ranking,
        edit: buttons.edit.ranking,
        delete: buttons.delete.ranking,
      },
    },
  };

  function getDialogType():
    | "delete"
    | "ranking"
    | "category"
    | "edit-ranking-score" {
    if (getDialogOnDelete()) return "delete";
    if (getRankingOrCategory() === "category") return "category";
    if (openDialog === "edit") return "edit-ranking-score";
    return "ranking";
  }
  const dialog = {
    title: getDialogTitle(),
    subtitle: getDialogSubTitle(),
    close: closeModal,
    open: !!openDialog,
    confirm: getHandleConfirm,
    confirmButtonText: _dialog.confirmText[openDialog as openDialogType],
    disabled: !name,
    placeholder: _dialog.placeholder(),
    value: {
      name,
      stars,
    },
    onChange: {
      name: (e: any) => setName(e.target.value),
      stars: {
        text: (e: any) => {
          const newValue = e.target.value === "" ? "" : Number(e.target.value);
          if (Number(newValue) > 5) return setStars(5);
          if (Number(newValue) < 0) return setStars(0);
          if (newValue === "") return setStars("");
          console.log("newValue: ", newValue);
          console.log("Number(Number(newValue).toFixed(2)): ", Number(Number(newValue).toFixed(2)));
          setStars(Number(Number(newValue).toFixed(2)));
        },
        click: (e: any, index: number) => {
          const { left, width } = e.currentTarget.getBoundingClientRect();
          const newRating =
            Math.round((index + (e.clientX - left) / width) * 2) / 2;
          setStars(newRating);
        },
      },
    },
    deleteText: getDialogOnDelete(),
    type: getDialogType(),
  };

  return {
    rankingsPage,
    dialog,
  };
};

export default useRanking;
