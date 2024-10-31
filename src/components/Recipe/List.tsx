import getRecipeContext from "@/context/getRecipeContext";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Link from "next/link";

export function List() {
  const { recipesPage } = getRecipeContext();

  return (
    <>
      {recipesPage.list?.map((category) => {
        return (
          <Accordion sx={{ width: "100%" }}>
            <AccordionSummary>
              <Stack
                onClick={(e) => {
                  if (!category.recipes.length) e.stopPropagation();
                }}
                sx={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Box display={"flex"} alignItems={"center"}>
                  <Box
                    sx={{
                      backgroundColor: "primary.main",
                      color: "secondary.main",
                    }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width={20}
                    height={20}
                    borderRadius="50%"
                    fontWeight={700}
                    marginRight={1}
                  >
                    {category.recipes.length}
                  </Box>
                  <Typography>{category?.category}</Typography>
                </Box>
                <Box>
                  <IconButton
                    edge="end"
                    aria-label="add"
                    onClick={(e) => {
                      recipesPage.buttons.recipe.add(e, category.category);
                    }}
                  >
                    <AddCircleIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={(e) => {
                      recipesPage.buttons.category.edit(e, category.category);
                    }}
                  >
                    <EditIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      recipesPage.buttons.category.delete(
                        e,
                        category.category
                      );
                    }}
                  >
                    <DeleteIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                </Box>
              </Stack>
            </AccordionSummary>
            {category.recipes.map((recipe) => (
              <AccordionDetails key={recipe.name}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Link
                      href={`receitas/${category.category}/${recipe.name}`}
                      style={{ color: "#CCC" }}
                    >
                      {recipe.name}
                    </Link>
                  </Box>
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={(e) => {
                        recipesPage.buttons.recipe.edit(
                          e,
                          category.category,
                          recipe.name
                        );
                      }}
                    >
                      <EditIcon sx={{ color: "primary.main" }} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        recipesPage.buttons.recipe.delete(
                          e,
                          category.category,
                          recipe.name
                        );
                      }}
                    >
                      <DeleteIcon sx={{ color: "primary.main" }} />
                    </IconButton>
                  </Box>
                </Box>
              </AccordionDetails>
            ))}
          </Accordion>
        );
      })}
    </>
  );
}
