import getShoppingContext from "@/context/getShoppingContext";
import { NavBar } from "@/components";
import { Rankings, Recipes, Shopping } from "@/views";

export default function Page() {
  const { page } = getShoppingContext();

  const views = {
    shopping: <Shopping />,
    recipes: <Recipes />,
    rankings: <Rankings />,
  };

  return (
    <>
      <NavBar />
      {views[page.current]}
    </>
  );
}
