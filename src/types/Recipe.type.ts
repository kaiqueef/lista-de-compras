import { Product } from "./Product.type";

export interface Recipe {
  category: string;
  recipes: Recipes[];
}

export interface Recipes {
  name: string;
  items: Product[];
}
