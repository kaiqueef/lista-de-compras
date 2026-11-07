import { Product } from "@/types/Product.type";
import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage.hook";
import useShoppingListType from "./types/useShoppingListType.type";
import { saveRemote, syncFromRemote } from "@/services/remoteSync";

const useShoppingList = (): useShoppingListType => {
  const [currentPage, setCurrentPage] = useState<
    "shopping" | "recipes" | "rankings"
  >("shopping");
  const { get, set } = useLocalStorage();

  const [shoppingList, setShoppingList] = useState<Product[] | null>(
    get("lista")
  );
  const [today, setToday] = useState<boolean>(false);

  function toggleToday() {
    setToday(!today);
  }

  function loadRemoteList() {
    return syncFromRemote<Product[]>("lista", (remoteList) => {
      set("lista", remoteList);
      setShoppingList(remoteList);
    });
  }

  const [_newProduct, setNewProduct] = useState<Product>();
  const [openEdit, _setOpenEdit] = useState<Product | null>(null);
  const [openDialogType, setOpenDialogType] = useState<"add" | "edit" | null>(
    null
  );

  function setOpenEdit(product: Product | null) {
    if (openEdit?.name === product?.name) return;
    if (openEdit === null && product === null) return;
    _setOpenEdit(product);
    if (product) setOpenDialogType("edit");
  }

  function closeModal() {
    setOpenDialogType(null);
    setOpenEdit(null);
  }

  function setNewProductList(key: string, newList: Product[]) {
    set(key, newList);
    setShoppingList(newList);
    saveRemote(key, newList);
  }

  const appendProduct = (key: string, product: Product) => {
    const item = get(key);
    const newItem = item ? [...item, product] : [product];
    setNewProductList(key, newItem);
  };

  const removeProduct = (key: string, productName: string) => {
    const list: Product[] = get(key);
    if (!list) return;
    const newList = list.filter((product) => product.name !== productName);
    setNewProductList(key, newList);
  };

  const editProduct = (
    key: string,
    oldProduct: Product,
    newProduct: Product
  ) => {
    removeProduct(key, oldProduct.name);
    appendProduct(key, newProduct);
  };

  const updateLastBuy = (
    key: string,
    product: Product,
    removeLastBuy = false
  ) => {
    const currentDate = new Date();
    const newProduct: Product = {
      ...product,
      lastBuy: removeLastBuy ? null : currentDate.toISOString(),
    };
    editProduct(key, product, newProduct);
  };

  const toggleFavorite = (product: Product) => {
    const newProduct: Product = {
      ...product,
      priority: !product.priority,
    };
    editProduct("lista", product, newProduct);
  };

  const localProductList = {
    append: appendProduct,
    edit: editProduct,
    remove: removeProduct,
    updateLastBuy: updateLastBuy,
    toggleFavorite: toggleFavorite,
  };

  const dialogConfirmText = !!openEdit ? "Atualizar" : "Adicionar";

  function changePage(page: "shopping" | "recipes" | "rankings") {
    setCurrentPage(page);
  }
  const pageTitles = {
    shopping: `Lista de ${today ? "Hoje" : "Compras"}`,
    recipes: "Receitas",
    rankings: "Rankings",
  };

  return {
    shoppingList,
    setNewProduct,
    openEdit,
    setOpenEdit,
    openDialogType,
    setOpenDialogType,
    closeModal,
    localProductList,
    loadRemoteList,
    dialogConfirmText,
    today,
    toggleToday,
    page: {
      set: changePage,
      current: currentPage,
      title: pageTitles[currentPage],
    },
  };
};

export default useShoppingList;
