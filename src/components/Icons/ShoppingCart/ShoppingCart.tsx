import Image from "next/image";
import { Cart, Item1, Item2, Item3, List, ShoppingCarWrapper } from "./styles";
import getShoppingContext from "@/context/getShoppingContext";

export function ShoppingCart() {
  const { today, toggleToday, page } = getShoppingContext();
  function handleClick() {
    if (page.current !== "shopping") return page.set("shopping");
    return toggleToday();
  }

  return (
    <ShoppingCarWrapper className={today ? "active" : ""} onClick={handleClick}>
      <List className="List">
        <Image
          quality={100}
          src="/icons/list-icon2.png"
          width={55}
          height={55}
          alt="icon"
          priority={true}
        />
      </List>
      <Item3 className="Item3" />
      <Item2 className="Item2" />
      <Item1 className="Item1" />
      <Cart className="Cart">
        <Image
          quality={100}
          src="/icons/shopping-cart.png"
          width={55}
          height={55}
          alt="icon"
          priority={true}
        />
      </Cart>
    </ShoppingCarWrapper>
  );
}
