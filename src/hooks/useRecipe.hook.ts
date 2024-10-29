import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage.hook";
import { RemoteStorage } from "remote-storage";
import { toast } from "react-toastify";
import useRecipeType from "./types/useRecipeType.type";
import { Recipe } from "@/types/Recipe.type";

const useRecipe = (): useRecipeType => {
  const { get, set } = useLocalStorage();
  const listName = "receitas";
  const remoteList = get("lista-remota");
  const remoteStorage = new RemoteStorage({ userId: remoteList });

  const containsList = get(listName);
  if (!containsList) loadRemoteList();

  const [recipeList, setRecipeList] = useState<Recipe[] | null>(get(listName));

  async function loadRemoteList() {
    const remoteList = (await remoteStorage.getItem(listName)) as Recipe[];
    if (remoteList) {
      set(listName, remoteList);
      setRecipeList(remoteList);
    }
  }

  const [openEdit, _setOpenEdit] = useState<Recipe | null>(null);
  const [openDialogType, setOpenDialogType] = useState<
    "add" | "edit" | string | null
  >(null);

  function setOpenEdit(product: Recipe | null) {
    if (openEdit?.category === product?.category) return;
    if (openEdit === null && product === null) return;
    _setOpenEdit(product);
    if (product) setOpenDialogType("edit");
  }

  function closeModal() {
    setOpenDialogType(null);
    setOpenEdit(null);
  }

  async function setNewRecipeList(key: string, newList: Recipe[]) {
    set(key, newList);
    setRecipeList(newList);
    if (remoteList) {
      const remoteStorage = new RemoteStorage({ userId: remoteList });
      await remoteStorage.setItem(listName, newList);
      updateRemoteList();
    }
  }

  const appendCategory = (recipe: Recipe) => {
    const item = get(listName);
    const newItem = item ? [...item, recipe] : [recipe];
    setNewRecipeList(listName, newItem);
  };

  const appendRecipe = (category: string, recipeName: string) => {
    const items: Recipe[] = get(listName);
    const _category = items.find((item) => item.category === category);
    _category?.recipes.push({ name: recipeName, items: [] });

    setNewRecipeList(listName, items);
  };

  const appendItem = (category: string, recipeName: string, item: string) => {
    const items: Recipe[] = get(listName);
    const _category = items.find((item) => item.category === category);
    if (!_category) return;
    const _recipe = _category.recipes.find(
      (recipe) => recipe.name === recipeName
    );
    if (!_recipe) return;
    _recipe?.items?.push({ name: item, lastBuy: null, renovalInDays: 1 });

    setNewRecipeList(listName, items);
  };

  const editItem = (
    categoryName: string,
    recipeName: string,
    itemOldName: string,
    itemNewName: string
  ) => {
    const items: Recipe[] = get(listName);

    const newRecipeList = items.map((category) => {
      if (category.category === categoryName)
        return {
          ...category,
          recipes: category.recipes.map((recipe) => {
            if (recipe.name === recipeName)
              return {
                ...recipe,
                items: recipe.items.map((item) =>
                  item.name.toLowerCase() === itemOldName.toLowerCase()
                    ? { ...item, name: itemNewName }
                    : item
                ),
              };
            return recipe;
          }),
        };
      return category;
    });
    setNewRecipeList(listName, newRecipeList);
  };

  const removeItem = (
    categoryName: string,
    recipeName: string,
    itemName: string
  ) => {
    const items: Recipe[] = get(listName);

    const newRecipeList = items.map((category) => {
      if (category.category === categoryName)
        return {
          ...category,
          recipes: category.recipes.map((recipe) => {
            if (recipe.name === recipeName)
              return {
                ...recipe,
                items: recipe.items.filter(
                  (item) => item.name.toLowerCase() !== itemName.toLowerCase()
                ),
              };
            return recipe;
          }),
        };
      return category;
    });
    setNewRecipeList(listName, newRecipeList);
  };

  const removeCategory = (categoryName: string) => {
    const list: Recipe[] = get(listName);
    if (!list) return;
    const newList = list.filter((product) => product.category !== categoryName);
    setNewRecipeList(listName, newList);
  };

  const removeRecipe = (category: string, recipeName: string) => {
    const list: Recipe[] = get(listName);
    if (!list) return;
    const newList = list.map((categoryitem) => {
      if (categoryitem.category === category) {
        return {
          category: categoryitem.category,
          recipes: categoryitem.recipes.filter(
            (recipe) => recipe.name !== recipeName
          ),
        };
      }
      return categoryitem;
    });
    setNewRecipeList(listName, newList);
  };

  const editCategory = (oldCategoryName: string, newCategoryName: string) => {
    const items: Recipe[] = get(listName);
    const newRecipes = items.map((item) => {
      if (item.category === oldCategoryName)
        return { ...item, category: newCategoryName };
      return item;
    });
    setNewRecipeList(listName, newRecipes);
  };

  const editRecipe = (
    category: string,
    oldRecipeName: string,
    newRecipeName: string
  ) => {
    const items: Recipe[] = get(listName);
    const newRecipes = items.map((item) => {
      if (item.category === category)
        return {
          category: item.category,
          recipes: item.recipes.map((recipe) => {
            if (recipe.name === oldRecipeName)
              return { ...recipe, name: newRecipeName };
            return recipe;
          }),
        };
      return item;
    });
    setNewRecipeList(listName, newRecipes);
  };

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

  function getItems(category: string, recipeName: string) {
    const items: Recipe[] = get(listName);
    if (!items) return undefined;
    const _category = items.find((item) => item.category === category);
    if (!_category) return;
    const _recipe = _category.recipes.find(
      (recipe) =>
        recipe.name.trim().toUpperCase() === recipeName.trim().toUpperCase()
    );
    if (!_recipe) return;
    return _recipe.items;
  }

  const updateLastBuy = (
    category: string,
    recipeName: string,
    productName: string,
    removeLastBuy = false
  ) => {
    const currentDate = new Date();
    const items: Recipe[] = get(listName);
    const _category = items.find((item) => item.category === category);
    if (!_category) return;
    const _recipe = _category.recipes.find(
      (recipe) => recipe.name === recipeName
    );
    if (!_recipe) return;
    _recipe?.items.map((item) => {
      if (item.name === productName) {
        item.lastBuy = removeLastBuy ? null : currentDate.toISOString();
      }
      return item;
    });
    setNewRecipeList(listName, items);
  };

  const localRecipeList = {
    category: {
      append: appendCategory,
      edit: editCategory,
      remove: removeCategory,
    },
    recipe: {
      append: appendRecipe,
      edit: editRecipe,
      remove: removeRecipe,
    },
    items: {
      append: appendItem,
      list: getItems,
      updateLastBuy: updateLastBuy,
      edit: editItem,
      remove: removeItem,
    },
  };

  return {
    recipeList,
    openDialogType,
    setOpenDialogType,
    closeModal,
    localRecipeList,
  };
};

export default useRecipe;
