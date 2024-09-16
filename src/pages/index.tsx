import { useLocalStorage } from "@/hooks/useLocalStorage.hook";
import { Typography } from "@mui/material";

export default function Page() {
  const listeTeste = [{ nome: "banana", date: new Date() }];
  const { set, get } = useLocalStorage();
  set("lista", listeTeste);
  //TODO:: CHECK IF THERE IS A LIST
  return (
    <>
      <Typography variant="h2">Lista de Compras</Typography>
    </>
  );
}
