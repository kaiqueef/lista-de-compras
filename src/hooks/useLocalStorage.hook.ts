import { Product } from "@/types/Product.type";

function isBrowser(): boolean {
  return (
    typeof window !== "undefined" && typeof window.document !== "undefined"
  );
}

export function useLocalStorage() {
  const get = (key: string) => {
    if (!isBrowser()) return;
    const item = window.localStorage.getItem(key);
    if (!item) return;
    return JSON.parse(item);
  };
  const set = (key: string, value: any) => {
    if (!isBrowser()) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  const remove = (key: string) => {
    if (!isBrowser()) return;
    window.localStorage.removeItem(key);
  };

  const appendProduct = (key: string, product: Product) => {
    if (!isBrowser()) return;
    const item = window.localStorage.getItem(key);
    if (!item) return;
    window.localStorage.setItem(
      key,
      JSON.stringify([...JSON.parse(item), product])
    );
  };

  const removeProduct = (key: string, productName: string) => {
    if (!isBrowser()) return;
    const list: Product[] = JSON.parse(window.localStorage.getItem(key) ?? "");
    if (!list) return;
    const newList = list.filter((product) => product.name !== productName);
    set(key, newList);
  };

  const editProduct = (
    key: string,
    oldProduct: Product,
    newProduct: Product
  ) => {
    if (!isBrowser()) return;
    removeProduct(key, oldProduct.name);
    appendProduct(key, newProduct);
  };

  const updateLastBuy = (
    key: string,
    product: Product,
    removeLastBuy = false
  ) => {
    if (!isBrowser()) return;
    const currentDate = new Date();
    const newProduct: Product = {
      ...product,
      lastBuy: removeLastBuy ? null : currentDate.toISOString(),
    };
    editProduct(key, product, newProduct);
  };

  const localProduct = {
    append: appendProduct,
    edit: editProduct,
    remove: removeProduct,
    updateLastBuy: updateLastBuy,
  };

  return {
    get,
    set,
    remove,
    localProduct,
  };
}
