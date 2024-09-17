interface Product {
  name: string;
  lastBuy: string | null;
  renovalInDays: number; //a cada quantos dias deve renovar
  priority?: boolean;
}
