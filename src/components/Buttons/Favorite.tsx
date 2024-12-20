import { Product } from "@/types/Product.type";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import getShoppingContext from "@/context/getShoppingContext";

export function Favorite({ product }: { product: Product }) {
  const { localProductList } = getShoppingContext();

  if (product?.priority)
    return (
      <IconButton
        edge="end"
        aria-label="edit"
        onClick={() => localProductList.toggleFavorite(product)}
      >
        <FavoriteIcon sx={{ color: "primary.main" }} />
      </IconButton>
    );
  return (
    <IconButton
      edge="end"
      aria-label="edit"
      onClick={() => localProductList.toggleFavorite(product)}
    >
      <FavoriteBorderOutlinedIcon sx={{ color: "primary.main" }} />
    </IconButton>
  );
}
