import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import { capitalizeString } from "@/utils/formatters";
import { useEffect } from "react";
import getRecipeContext from "@/context/getRecipeContext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Product } from "@/types/Product.type";
import { isChecked } from "@/utils/product";
import { NavBar, RecipeDialog } from "@/components";
import { Recipes } from "@/components/Icons/Recipes";

const RecipePage = () => {
  const router = useRouter();
  const category = router.query.category as string;
  const recipe = router.query.recipe as string;
  const { recipePage } = getRecipeContext();

  if (typeof category !== "string" || typeof recipe !== "string") {
    return <div>Invalid category or recipe</div>;
  }

  const shoppingList = recipePage.product.list(category, recipe);
  if (!shoppingList) {
    router.push("/receitas");
    return null;
  }

  useEffect(() => {
    recipePage.setProps({
      category,
      recipe,
    });
  }, []);

  return (
    <>
      <NavBar
        title={`${capitalizeString(category)} - ${capitalizeString(recipe)}`}
        icon={<Recipes />}
      />
      <Stack alignItems={"center"}>
        <Box sx={{ width: "100%", display: "flex" }}>
          <Button
            variant="outlined"
            onClick={recipePage.buttons.add}
            sx={{ width: "100%", m: 2 }}
          >
            Adicionar ingrediente
          </Button>
        </Box>
        <List sx={{ width: "100%" }}>
          {shoppingList.map((product: Product) => {
            return (
              <ListItem
                disablePadding
                style={{
                  textDecoration: isChecked(product) ? "line-through" : "none",
                  opacity: isChecked(product) ? 0.5 : 1,
                }}
                onClick={() => {
                  recipePage.product.onToggle(
                    category,
                    recipe,
                    product.name,
                    isChecked(product)
                  );
                }}
              >
                <ListItemButton>
                  <ListItemText primary={product.name} />
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={(e) => {
                      recipePage.buttons.edit(e, product.name);
                    }}
                  >
                    <EditIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      recipePage.buttons.delete(e, product.name);
                    }}
                  >
                    <DeleteIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Stack>

      <RecipeDialog />
    </>
  );
};
export default RecipePage;
