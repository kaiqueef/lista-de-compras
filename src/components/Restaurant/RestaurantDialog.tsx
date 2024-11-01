import { TextField, Typography } from "@mui/material";
import { Dialog } from "../Dialog/shared";

import React from "react";
import { Box, IconButton } from "@mui/material";
import getRestaurantContext from "@/context/getRestaurantContext";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";

export function RestaurantDialog() {
  const { dialog } = getRestaurantContext();
  console.log("dialog: ", dialog.subtitle);

  const renderStar = (index: number) => {
    const roundedRating = Math.round(Number(dialog.value.stars) * 2) / 2;
    if (index + 1 <= roundedRating) return <StarIcon />;
    if (index + 0.5 <= roundedRating) return <StarHalfIcon />;
    return <StarBorderIcon />;
  };

  const body = {
    delete: dialog.deleteText,
    category: (
      <TextField
        autoFocus
        margin="dense"
        label={dialog.placeholder}
        type="text"
        fullWidth
        value={dialog.value.name}
        onChange={dialog.onChange.name}
      />
    ),
    restaurant: (
      <>
        <TextField
          autoFocus
          margin="dense"
          label={dialog.placeholder}
          type="text"
          fullWidth
          value={dialog.value.name}
          onChange={dialog.onChange.name}
        />
        <TextField
          autoFocus
          margin="dense"
          label={"Nota"}
          type="number"
          fullWidth
          value={dialog.value.stars}
          onChange={dialog.onChange.stars.text}
        />
      </>
    ),
    "edit-restaurant-score": (
      <>
        <Box display="flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <IconButton
              key={index}
              onClick={(e) => dialog.onChange.stars.click(e, index)}
              sx={{ paddingTop: 0 }}
            >
              {renderStar(index)}
            </IconButton>
          ))}
        </Box>
        <TextField
          autoFocus
          margin="dense"
          label={"Nota"}
          type="number"
          fullWidth
          value={dialog.value.stars}
          onChange={dialog.onChange.stars.text}
        />
      </>
    ),
  };

  return (
    <Dialog
      title={dialog.title}
      closeModal={dialog.close}
      isOpen={dialog.open}
      handleConfirm={dialog.confirm}
      confirmText={dialog.confirmButtonText}
      disableConfirm={dialog.disabled}
      subtitle={
        !!dialog.subtitle && (
          <Typography fontSize={12}>
            Categoria: <b>{dialog.subtitle}</b>
          </Typography>
        )
      }
    >
      {body[dialog.type]}
    </Dialog>
  );
}
