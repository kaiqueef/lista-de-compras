import { Product } from "@/types/Product.type";
import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage.hook";
import useShoppingListType from "./types/useShoppingListType.type";
import { RemoteStorage } from "remote-storage";
import { toast } from "react-toastify";

const useShoppingList = (): useShoppingListType => {
  const { get, set } = useLocalStorage();
  const remoteList = get("lista-remota");
  const remoteStorage = new RemoteStorage({ userId: remoteList });

  const containsList = get("lista");
  if (!containsList) loadRemoteList();

  const [shoppingList, setShoppingList] = useState<Product[] | null>(
    get("lista")
  );

  async function loadRemoteList() {
    const remoteList = (await remoteStorage.getItem("lista")) as Product[];
    if (remoteList) {
      set("lista", remoteList);
      setShoppingList(remoteList);
    }
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

  async function setNewProductList(key: string, newList: Product[]) {
    set(key, newList);
    setShoppingList(newList);
    if (remoteList) {
      const remoteStorage = new RemoteStorage({ userId: remoteList });
      await remoteStorage.setItem("lista", newList);
    }
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
    updateRemoteList();
  };

  const toggleFavorite = (product: Product) => {
    const newProduct: Product = {
      ...product,
      priority: !product.priority,
    };
    editProduct("lista", product, newProduct);
    updateRemoteList();
  };

  async function updateRemoteList() {
    if (remoteList) {
      try {
        const remoteStorage = new RemoteStorage({ userId: remoteList });
        await remoteStorage.setItem("lista", get("lista"));
        toast.success("Lista atualizada!");
      } catch {
        toast.error("Erro ao atualizar lista remota");
      }
    }
  }

  const localProductList = {
    append: appendProduct,
    edit: editProduct,
    remove: removeProduct,
    updateLastBuy: updateLastBuy,
    toggleFavorite: toggleFavorite,
    updateRemoteList: updateRemoteList,
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
    loadRemoteList
  };
};

export default useShoppingList;
