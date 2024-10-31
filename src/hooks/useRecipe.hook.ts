import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage.hook";
import { RemoteStorage } from "remote-storage";
import { toast } from "react-toastify";
import useRecipeType, { openDialogType } from "./types/useRecipeType.type";
import { Recipe } from "@/types/Recipe.type";
import { Product } from "@/types/Product.type";
import { isChecked } from "@/utils/product";
import { compareStrings } from "@/utils/compareStrings";

const useRecipe = (): useRecipeType => {
  const { get, set } = useLocalStorage();
  const listName = "receitas";
  const remoteList = get("lista-remota");
  const remoteStorage = new RemoteStorage({ userId: remoteList });

  const containsList = get(listName);
  if (!containsList) loadRemoteList();

  const [recipeList, setRecipeList] = useState<Recipe[] | null>(get(listName));
  const [name, setName] = useState("");
  const [openDialog, setOpenDialog] = useState<openDialogType | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openRecipe, setOpenRecipe] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [recipePageProps, setRecipePageProps] = useState({
    category: "",
    recipe: "",
  });
  const currentPage = !!recipePageProps.category ? "recipe" : "recipes";

  async function loadRemoteList() {
    const remoteList = (await remoteStorage.getItem(listName)) as Recipe[];
    if (remoteList) {
      set(listName, remoteList);
      setRecipeList(remoteList);
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

  async function setNewRecipeList(key: string, newList: Recipe[]) {
    newList.sort((a, b) => {
      return a.category.localeCompare(b.category);
    });
    newList.forEach((category) => {
      category.recipes.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    });

    set(key, newList);

    setRecipeList(newList);
    if (remoteList) {
      const remoteStorage = new RemoteStorage({ userId: remoteList }); //TODO:: CHECAR ISSO
      await remoteStorage.setItem(listName, newList);
      updateRemoteList();
    }
  }

  const exists = {
    category: () =>
      recipeList?.some((recipe) => compareStrings(recipe.category, name)),
    recipe: (category: string) => {
      const recipe = recipeList?.find((item) =>
        compareStrings(item.category, category)
      )?.recipes;
      return recipe?.some((recipe) => compareStrings(recipe.name, name));
    },
    item: (category: string, recipeName: string, itemName: string) => {
      const items: Recipe[] = get(listName);
      const _category = items.find((item) =>
        compareStrings(item.category, category)
      );
      if (!_category) return;
      const _recipe = _category.recipes.find((recipe) =>
        compareStrings(recipe.name, recipeName)
      );
      if (!_recipe) return;
      return _recipe.items.some((item) => compareStrings(item.name, itemName));
    },
  };

  const add = {
    category: () => {
      if (exists.category()) {
        throw new Error(`Categoria "${name}" já existe!`);
      }
      const newCategory: Recipe = {
        category: name,
        recipes: [],
      };
      const item = get(listName);
      const newItem = item ? [...item, newCategory] : [newCategory];
      setNewRecipeList(listName, newItem);
    },
    recipe: () => {
      const category = openCategory;
      if (!category) return;
      if (exists.recipe(category)) {
        throw new Error(`Receita "${name}" já existe!`);
      }
      const items: Recipe[] = get(listName);
      const _category = items.find((item) =>
        compareStrings(item.category, category)
      );
      _category?.recipes.push({ name, items: [] });

      setNewRecipeList(listName, items);
    },
    item: () => {
      const { category, recipe: recipeName } = recipePageProps;
      if (exists.item(category, recipeName, name)) {
        throw new Error(`Ingrediente ${name} já existe!`);
      }
      const items: Recipe[] = get(listName);
      const _category = items.find((item) =>
        compareStrings(item.category, category)
      );
      if (!_category) return;
      const _recipe = _category.recipes.find((recipe) =>
        compareStrings(recipe.name, recipeName)
      );
      if (!_recipe) return;
      _recipe.items.push({ name, lastBuy: null, renovalInDays: 1 });

      setNewRecipeList(listName, items);
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
      const items: Recipe[] = get(listName);
      const newRecipes = items.map((item) => {
        if (compareStrings(item.category, oldCategoryName))
          return { ...item, category: newCategoryName };
        return item;
      });
      setNewRecipeList(listName, newRecipes);
    },
    recipe: () => {
      if (!openCategory || !openRecipe) return;
      const category = openCategory;
      if (exists.recipe(category)) {
        throw new Error(`Receita "${name}" já existe!`);
      }
      const oldRecipeName = openRecipe;
      const newRecipeName = name;
      const items: Recipe[] = get(listName);
      const newRecipes = items.map((item) => {
        if (compareStrings(item.category, category))
          return {
            category: item.category,
            recipes: item.recipes.map((recipe) => {
              if (compareStrings(recipe.name, oldRecipeName))
                return { ...recipe, name: newRecipeName };
              return recipe;
            }),
          };
        return item;
      });
      setNewRecipeList(listName, newRecipes);
    },
    item: () => {
      const itemOldName = openItem;
      const itemNewName = name;
      if (!itemOldName) return;
      const { category: categoryName, recipe: recipeName } = recipePageProps;
      if (exists.item(categoryName, recipeName, name)) {
        throw new Error(`Ingrediente ${name} já existe!`);
      }
      const items: Recipe[] = get(listName);

      const newRecipeList = items.map((category) => {
        if (compareStrings(category.category, categoryName))
          return {
            ...category,
            recipes: category.recipes.map((recipe) => {
              if (compareStrings(recipe.name, recipeName))
                return {
                  ...recipe,
                  items: recipe.items.map((item) =>
                    compareStrings(item.name, itemOldName)
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
    },
  };

  const _delete = {
    category: () => {
      const categoryName = openCategory;
      if (!categoryName) return;
      const list: Recipe[] = get(listName);
      if (!list) return;
      const newList = list.filter(
        (product) => product.category !== categoryName
      );
      setNewRecipeList(listName, newList);
    },
    recipe: () => {
      if (!openCategory) return;
      const category = openCategory;
      const recipeName = name;
      const list: Recipe[] = get(listName);
      if (!list) return;
      const newList = list.map((categoryitem) => {
        if (compareStrings(categoryitem.category, category)) {
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
    },
    item: () => {
      const { category: categoryName, recipe: recipeName } = recipePageProps;
      const items: Recipe[] = get(listName);

      const newRecipeList = items.map((category) => {
        if (compareStrings(category.category, categoryName))
          return {
            ...category,
            recipes: category.recipes.map((recipe) => {
              if (compareStrings(recipe.name, recipeName))
                return {
                  ...recipe,
                  items: recipe.items.filter(
                    (item) => !compareStrings(item.name, name)
                  ),
                };
              return recipe;
            }),
          };
        return category;
      });
      setNewRecipeList(listName, newRecipeList);
    },
  };

  function getItems(category: string, recipeName: string): Product[] {
    const items: Recipe[] = get(listName);
    if (!items) return [];
    const _category = items.find((item) =>
      compareStrings(item.category, category)
    );
    if (!_category) return [];
    const _recipe = _category.recipes.find((recipe) =>
      compareStrings(recipe.name, recipeName)
    );
    if (!_recipe) return [];

    const sortedList = _recipe.items.sort((a, b) => {
      if (isChecked(a) === isChecked(b)) {
        return a.name.localeCompare(b.name);
      }
      return isChecked(a) ? 1 : -1;
    });

    return sortedList;
  }

  const updateLastBuy = (
    category: string,
    recipeName: string,
    productName: string,
    deleteLastBuy = false
  ) => {
    const currentDate = new Date();
    const items: Recipe[] = get(listName);
    const _category = items.find((item) =>
      compareStrings(item.category, category)
    );
    if (!_category) return;
    const _recipe = _category.recipes.find((recipe) =>
      compareStrings(recipe.name, recipeName)
    );
    if (!_recipe) return;
    _recipe?.items.map((item) => {
      if (compareStrings(item.name, productName)) {
        item.lastBuy = deleteLastBuy ? null : currentDate.toISOString();
      }
      return item;
    });
    setNewRecipeList(listName, items);
  };

  function closeModal() {
    setOpenDialog(null);
    setOpenItem(null);
    setName("");
    setOpenCategory(null);
    setOpenRecipe(null);
  }

  const handleConfirm = {
    recipes: {
      recipe: {
        add: add.recipe,
        edit: edit.recipe,
        delete: _delete.recipe,
      },
      category: {
        add: add.category,
        edit: edit.category,
        delete: _delete.category,
      },
    },
    recipe: {
      add: add.item,
      edit: edit.item,
      delete: _delete.item,
    },
  };

  function getRecipeOrCategory() {
    if (openRecipe) return "recipe";
    return openCategory && openDialog === "add" ? "recipe" : "category";
  }

  function getHandleConfirm() {
    const level = getRecipeOrCategory();
    try {
      if (currentPage === "recipes") {
        handleConfirm.recipes[level][openDialog as openDialogType]();
      } else {
        handleConfirm.recipe[openDialog as openDialogType]();
      }
      closeModal();
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    }
  }

  const _dialog = {
    placeholder: () => {
      const placeholders = {
        recipe: () => {
          if (openDialog === "edit") return "Edite a ingrediente";
          return "Nome do ingrediente";
        },
        recipes: () => {
          if (openRecipe) {
            if (openDialog === "edit") return `Edite a receita`;
          }
          if (openDialog === "edit") return "Edite a categoria";
          if (!openCategory) return "Nome da nova categoria";
          return "Nome da nova receita";
        },
      };
      return placeholders[currentPage]();
    },
    confirmText: {
      add: "Adicionar",
      edit: "Editar",
      delete: "Deletar",
    },
    title: {
      recipe: {
        add: "Adicionar ingrediente",
        edit: "Editar",
        delete: "Deletar",
      },
      recipes: {
        category: {
          add: "Adicionar Categoria",
          edit: "Edição da categoria",
          delete: "Deletar",
        },
        recipe: {
          add: `Nova receita de ${openCategory}`,
          edit: "Edição da receita",
          delete: "Deletar",
        },
      },
    },
  };

  function openModal(props: {
    type: openDialogType;
    e?: any;
    category?: string;
    name?: string;
    recipeName?: string;
    openItem?: string;
  }) {
    const { type, e, category, name, recipeName, openItem } = props;
    setOpenDialog(type);
    if (e) e.stopPropagation();
    if (category) setOpenCategory(category);
    if (name) setName(name);
    if (recipeName) setOpenRecipe(recipeName);
    if (openItem) setOpenItem(openItem);
  }

  const buttons = {
    add: {
      category: () => openModal({ type: "add" }),
      recipe: (e: any, category: string) =>
        openModal({ type: "add", e, category }),
      item: () => openModal({ type: "add" }),
    },
    edit: {
      category: (e: any, category: string) =>
        openModal({ type: "edit", e, category, name: category }),
      recipe: (e: any, category: string, recipeName: string) =>
        openModal({ type: "edit", e, category, recipeName, name: recipeName }),
      item: (e: any, productName: string) =>
        openModal({
          type: "edit",
          e,
          name: productName,
          openItem: productName,
        }),
    },
    delete: {
      category: (e: any, category: string) =>
        openModal({ type: "delete", e, category, name: category }),
      recipe: (e: any, category: string, recipeName: string) =>
        openModal({
          type: "delete",
          e,
          category,
          recipeName,
          name: recipeName,
        }),
      item: (e: any, productName: string) =>
        openModal({ type: "delete", e, name: productName }),
    },
  };

  function getDialogTitle() {
    const level = getRecipeOrCategory();
    return currentPage === "recipe"
      ? _dialog.title.recipe[openDialog as openDialogType]
      : _dialog.title.recipes[level][openDialog as openDialogType];
  }

  function getDialogOnDelete() {
    if (openDialog !== "delete") return "";
    const text = {
      recipes: `Deseja deletar a ${
        openRecipe ? "receita" : "categoria"
      } ${name}?`,
      recipe: `Deseja deletar o ingrediente ${name}?`,
    };
    return text[currentPage];
  }

  const recipePage = {
    setProps: setRecipePageProps,
    product: {
      list: getItems,
      onToggle: updateLastBuy,
    },
    buttons: {
      add: buttons.add.item,
      edit: buttons.edit.item,
      delete: buttons.delete.item,
    },
  };

  const recipesPage = {
    list: recipeList,
    buttons: {
      category: {
        add: buttons.add.category,
        edit: buttons.edit.category,
        delete: buttons.delete.category,
      },
      recipe: {
        add: buttons.add.recipe,
        edit: buttons.edit.recipe,
        delete: buttons.delete.recipe,
      },
    },
  };

  const dialog = {
    title: getDialogTitle(),
    close: closeModal,
    open: !!openDialog,
    confirm: getHandleConfirm,
    confirmButtonText: _dialog.confirmText[openDialog as openDialogType],
    disabled: !name,
    placeholder: _dialog.placeholder(),
    value: name,
    onChange: (e: any) => setName(e.target.value),
    deleteText: getDialogOnDelete(),
  };

  return {
    recipePage,
    recipesPage,
    dialog,
  };
};

export default useRecipe;
