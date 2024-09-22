import { Product } from "@/types/Product.type";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

export default function FavoriteButton({ product }: { product: Product }) {
  const { priority } = product; //TODO:: ADD TOGGLE FUNCTION ONCLICK
  if (priority)
    return (
      <IconButton
        edge="end"
        aria-label="edit"
        // onClick={() => setOpenEdit(product)}
      >
        <FavoriteIcon sx={{ color: "#AAA" }} />
      </IconButton>
    );
  return (
    <IconButton
      edge="end"
      aria-label="edit"
      // onClick={() => setOpenEdit(product)}
    >
      <FavoriteBorderOutlinedIcon sx={{ color: "#AAA" }} />
    </IconButton>
  );
}
