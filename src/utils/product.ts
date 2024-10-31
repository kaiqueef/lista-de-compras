import { Product } from "@/types/Product.type";

export function isChecked(product: Product) {
  return !(
    !product.lastBuy ||
    isDifferenceGreaterThan(product.lastBuy, product.renovalInDays)
  );
}

export function isDifferenceGreaterThan(
  date: string | null,
  numberOfDays: number
): boolean {
  if (!date) return false;
  const inputDate = new Date(date);
  const currentDate = new Date();

  inputDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  const timeDifference = Math.abs(currentDate.getTime() - inputDate.getTime());
  const dayDifference = timeDifference / (1000 * 3600 * 24);
  return dayDifference > numberOfDays;
}
