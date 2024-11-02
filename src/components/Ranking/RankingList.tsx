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
import getRankingContext from "@/context/getRankingContext";

import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";

export function RankingList() {
  const { rankingsPage } = getRankingContext();

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
      {rankingsPage.list?.map((category) => {
        return (
          <Accordion sx={{ width: "100%" }}>
            <AccordionSummary>
              <Stack
                onClick={(e) => {
                  if (!category.rankings.length) e.stopPropagation();
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
                    {category.rankings.length}
                  </Box>
                  <Typography>{category?.category}</Typography>
                </Box>
                <Box>
                  <IconButton
                    edge="end"
                    aria-label="add"
                    onClick={(e) => {
                      rankingsPage.buttons.ranking.add(
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
                      rankingsPage.buttons.category.edit(
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
                      rankingsPage.buttons.category.delete(
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
            {category.rankings.map((ranking) => (
              <AccordionDetails key={ranking.name}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={(e) =>
                    rankingsPage.buttons.ranking.edit(
                      e,
                      category.category,
                      ranking.name,
                      ranking.stars
                    )
                  }
                >
                  <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                    <Box sx={{ marginRight: 1 }}>
                      {renderStar(ranking.stars)}
                    </Box>
                    {ranking.stars.toFixed(1)}
                  </Box>
                  <Typography>{ranking.name}</Typography>
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        rankingsPage.buttons.ranking.delete(
                          e,
                          category.category,
                          ranking.name
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
