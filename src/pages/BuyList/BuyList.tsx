import { useLocalStorage } from "@/hooks/useLocalStorage.hook";
import { Box } from "@mui/material";
import { useEffect } from "react";

export function BuyList() {
  const listeTeste = [{ nome: "banana" }];
  const { set, get } = useLocalStorage();
  set("lista", listeTeste);
  
  return <Box>Lista de compras</Box>;
}
