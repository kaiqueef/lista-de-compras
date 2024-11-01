import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage.hook";
import { RemoteStorage } from "remote-storage";
import { toast } from "react-toastify";
import useRestaurantType, {
  openDialogType,
} from "./types/useRestaurantType.type";
import { compareStrings } from "@/utils/compareStrings";
import { Restaurants } from "@/types/Restaurant.type";

const useRestaurant = (): useRestaurantType => {
  const { get, set } = useLocalStorage();
  const listName = "restaurantes";
  const remoteList = get("lista-remota");
  const remoteStorage = new RemoteStorage({ userId: remoteList });

  const containsList = get(listName);
  if (!containsList) loadRemoteList();

  const [restaurantList, setRestaurantList] = useState<Restaurants[]>(
    get(listName)
  );
  const [name, setName] = useState("");
  const [stars, setStars] = useState<number | "">("");
  const [openDialog, setOpenDialog] = useState<openDialogType | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openRestaurant, setOpenRestaurant] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);

  async function loadRemoteList() {
    const remoteList = (await remoteStorage.getItem(listName)) as Restaurants[];
    if (remoteList) {
      set(listName, remoteList);
      setRestaurantList(remoteList);
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

  async function setNewRestaurantList(key: string, newList: Restaurants[]) {
    newList.sort((a, b) => {
      return a.category.localeCompare(b.category);
    });
    newList.forEach((category) => {
      category.restaurants.sort((a, b) => {
        return b.stars - a.stars;
      });
    });

    set(key, newList);

    setRestaurantList(newList);
    if (remoteList) {
      const remoteStorage = new RemoteStorage({ userId: remoteList }); //TODO:: CHECAR ISSO
      await remoteStorage.setItem(listName, newList);
      updateRemoteList();
    }
  }

  const exists = {
    category: () =>
      restaurantList?.some((restaurant) =>
        compareStrings(restaurant.category, name)
      ),
    restaurant: (category: string, caseSensitive = true) => {
      const restaurant = restaurantList?.find((item) =>
        compareStrings(item.category, category)
      )?.restaurants;
      return restaurant?.some((restaurant) =>
        caseSensitive
          ? compareStrings(restaurant.name, name)
          : restaurant.name.trim() === name
      );
    },
  };

  const add = {
    category: () => {
      if (exists.category()) {
        throw new Error(`Categoria "${name}" já existe!`);
      }
      const newCategory: Restaurants = {
        category: name,
        restaurants: [],
      };
      const item = get(listName);
      const newItem = item ? [...item, newCategory] : [newCategory];
      setNewRestaurantList(listName, newItem);
    },
    restaurant: () => {
      const category = openCategory;
      if (!category) return;
      if (exists.restaurant(category)) {
        throw new Error(`Restaurante "${name}" já existe!`);
      }
      const items: Restaurants[] = get(listName);
      const _category = items.find((item) =>
        compareStrings(item.category, category)
      );
      _category?.restaurants.push({ name, stars: Number(stars) });
      setNewRestaurantList(listName, items);
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
      const items: Restaurants[] = get(listName);
      const newRestaurants = items.map((item) => {
        if (compareStrings(item.category, oldCategoryName))
          return { ...item, category: newCategoryName };
        return item;
      });
      setNewRestaurantList(listName, newRestaurants);
    },
    restaurant: () => {
      if (!openCategory || !openRestaurant) return;
      const category = openCategory;
      if (stars === "") {
        throw new Error("Insira uma nota válida!");
      }
      const oldRestaurantName = openRestaurant;
      const newRestaurantName = name;
      const items: Restaurants[] = get(listName);
      const newRestaurants = items.map((item) => {
        if (compareStrings(item.category, category))
          return {
            category: item.category,
            restaurants: item.restaurants.map((restaurant) => {
              if (compareStrings(restaurant.name, oldRestaurantName))
                return { ...restaurant, name: newRestaurantName, stars };
              return restaurant;
            }),
          };
        return item;
      });
      setNewRestaurantList(listName, newRestaurants);
    },
  };

  const _delete = {
    category: () => {
      const categoryName = openCategory;
      if (!categoryName) return;
      const list: Restaurants[] = get(listName);
      if (!list) return;
      const newList = list.filter(
        (product) => product.category !== categoryName
      );
      setNewRestaurantList(listName, newList);
    },
    restaurant: () => {
      if (!openCategory) return;
      const category = openCategory;
      const restaurantName = name;
      const list: Restaurants[] = get(listName);
      if (!list) return;
      const newList = list.map((categoryitem) => {
        if (compareStrings(categoryitem.category, category)) {
          return {
            category: categoryitem.category,
            restaurants: categoryitem.restaurants.filter(
              (restaurant) => restaurant.name !== restaurantName
            ),
          };
        }
        return categoryitem;
      });
      setNewRestaurantList(listName, newList);
    },
  };

  function closeModal() {
    setOpenDialog(null);
    setOpenItem(null);
    setName("");
    setStars(0);
    setOpenCategory(null);
    setOpenRestaurant(null);
  }

  const handleConfirm = {
    category: {
      add: add.category,
      edit: edit.category,
      delete: _delete.category,
    },
    restaurant: {
      add: add.restaurant,
      edit: edit.restaurant,
      delete: _delete.restaurant,
    },
  };

  function getRestaurantOrCategory() {
    if (openRestaurant) return "restaurant";
    return openCategory && openDialog === "add" ? "restaurant" : "category";
  }

  function getHandleConfirm() {
    const level = getRestaurantOrCategory();
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
        if (openRestaurant) {
          if (openDialog === "edit") return `Nome do restaurante`;
        }
        if (openDialog === "edit") return "Nome da categoria";
        if (!openCategory) return "Nome da nova categoria";
        return "Nome do novo restaurante";
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
      restaurant: {
        add: `Novo restaurante`,
        edit: String(openRestaurant),
        delete: "Deletar",
      },
    },
    subtitle: {
      category: {
        add: "",
        edit: "",
        delete: "",
      },
      restaurant: {
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
    restaurantName?: string;
    openItem?: string;
  }) {
    const { type, e, category, name, restaurantName, openItem, stars } = props;
    setOpenDialog(type);
    if (e) e.stopPropagation();
    if (category) setOpenCategory(category);
    if (name) setName(name);
    if (stars) setStars(stars);
    if (restaurantName) setOpenRestaurant(restaurantName);
    if (openItem) setOpenItem(openItem);
  }

  const buttons = {
    add: {
      category: () => openModal({ type: "add" }),
      restaurant: (e: any, category: string) =>
        openModal({ type: "add", e, category }),
    },
    edit: {
      category: (e: any, category: string) =>
        openModal({ type: "edit", e, category, name: category }),
      restaurant: (
        e: any,
        category: string,
        restaurantName: string,
        stars: number
      ) => {
        openModal({
          type: "edit",
          e,
          category,
          restaurantName,
          name: restaurantName,
          stars,
        });
      },
    },
    delete: {
      category: (e: any, category: string) =>
        openModal({ type: "delete", e, category, name: category }),
      restaurant: (e: any, category: string, restaurantName: string) =>
        openModal({
          type: "delete",
          e,
          category,
          restaurantName,
          name: restaurantName,
        }),
      item: (e: any, productName: string) =>
        openModal({ type: "delete", e, name: productName }),
    },
  };

  function getDialogTitle() {
    const level = getRestaurantOrCategory();
    return _dialog.title[level][openDialog as openDialogType];
  }

  function getDialogSubTitle() {
    const level = getRestaurantOrCategory();
    return _dialog.subtitle[level][openDialog as openDialogType];
  }

  function getDialogOnDelete() {
    if (openDialog !== "delete") return "";
    const text = `Deseja deletar ${
      //TODO:: USE LEVEL
      openRestaurant ? "o restaurante" : "a categoria"
    } ${name}?`;

    return text;
  }

  const restaurantsPage = {
    list: restaurantList,
    buttons: {
      category: {
        add: buttons.add.category,
        edit: buttons.edit.category,
        delete: buttons.delete.category,
      },
      restaurant: {
        add: buttons.add.restaurant,
        edit: buttons.edit.restaurant,
        delete: buttons.delete.restaurant,
      },
    },
  };

  function getDialogType():
    | "delete"
    | "restaurant"
    | "category"
    | "edit-restaurant-score" {
    if (getDialogOnDelete()) return "delete";
    if (getRestaurantOrCategory() === "category") return "category";
    if (openDialog === "edit") return "edit-restaurant-score";
    return "restaurant";
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
          setStars(Number(newValue.toFixed(2)));
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
    restaurantsPage,
    dialog,
  };
};

export default useRestaurant;
