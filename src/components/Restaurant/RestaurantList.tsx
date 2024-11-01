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
import getRestaurantContext from "@/context/getRestaurantContext";

import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";

export function RestaurantList() {
  const { restaurantsPage } = getRestaurantContext();

  const renderStar = (value: number) => {
    const newValue = Math.round((value / 5) * 2) / 2;
    if (newValue === 1)
      return <StarIcon style={{ fontSize: 20, color: "#CCC" }} />;
    if (newValue === 0.5)
      return <StarHalfIcon style={{ fontSize: 20, color: "#CCC" }} />;
    return <StarBorderIcon style={{ fontSize: 20, color: "#CCC" }} />;
  };

  return (
    <>
      {restaurantsPage.list?.map((category) => {
        return (
          <Accordion sx={{ width: "100%" }}>
            <AccordionSummary>
              <Stack
                onClick={(e) => {
                  if (!category.restaurants.length) e.stopPropagation();
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
                    {category.restaurants.length}
                  </Box>
                  <Typography>{category?.category}</Typography>
                </Box>
                <Box>
                  <IconButton
                    edge="end"
                    aria-label="add"
                    onClick={(e) => {
                      restaurantsPage.buttons.restaurant.add(
                        e,
                        category.category
                      );
                    }}
                  >
                    <AddCircleIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={(e) => {
                      restaurantsPage.buttons.category.edit(
                        e,
                        category.category
                      );
                    }}
                  >
                    <EditIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      restaurantsPage.buttons.category.delete(
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
            {category.restaurants.map((restaurant) => (
              <AccordionDetails key={restaurant.name}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={(e) =>
                    restaurantsPage.buttons.restaurant.edit(
                      e,
                      category.category,
                      restaurant.name,
                      restaurant.stars
                    )
                  }
                >
                  <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                    <Box sx={{ marginRight: 1 }}>
                      {renderStar(restaurant.stars)}
                    </Box>
                    {restaurant.stars.toFixed(1)}
                  </Box>
                  <Typography>{restaurant.name}</Typography>
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        restaurantsPage.buttons.restaurant.delete(
                          e,
                          category.category,
                          restaurant.name
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
