import { Product } from "@/types/Product.type";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import getShoppingContext from "@/context/getShoppingContext";
import useIsClient from "@/hooks/useIsClient";

export default function Favorite({ product }: { product: Product }) {
  const isClient = useIsClient(); //TODO:: IMPROVE THIS CODE
  if (!isClient) {
    return null;
  }
  const { localProductList } = getShoppingContext();

  if (product?.priority)
    return (
      <IconButton
        edge="end"
        aria-label="edit"
        onClick={() => localProductList.toggleFavorite(product)}
      >
        <FavoriteIcon sx={{ color: "#AAA" }} />
      </IconButton>
    );
  return (
    <IconButton
      edge="end"
      aria-label="edit"
      onClick={() => localProductList.toggleFavorite(product)}
    >
      <FavoriteBorderOutlinedIcon sx={{ color: "#AAA" }} />
    </IconButton>
  );
}
