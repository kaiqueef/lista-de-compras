interface Product {
  name: string;
  priority: boolean;
  lastBuy: Date;
  renovalInDays?: number; //a cada quantos dias deve renovar
}
