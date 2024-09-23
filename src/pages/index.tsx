import { Typography } from "@mui/material";
import ShoppingList from "./ShoppingList";
import AddItem from "./components/buttons/AddItem";
import { RemoteStorage } from "remote-storage";
import EditProduct from "./components/dialog/EditProduct";
import { ShoppingListProvider } from "@/context/shoppingListContext";

export default function Page() {
  //TODO:: CHECK IF THERE IS A REMOTE LIST?
  // const [_newProduct, setNewProduct] = useState<Product>();
  // const remoteStorage = new RemoteStorage({ userId: "kaique" }); //TODO:: CHECAR SE EXISTE USERID NO LOCALSTORAGE
  //TODO:: DEIXAR USUÁRIO COLOCAR SEU USERID

  // async function saveValues() {
  //   const list: Product[] | null = get("lista");
  //   await remoteStorage.setItem("lista", list);
  // }

  // async function loadList() {
  //   const remoteList = (await remoteStorage.getItem("lista")) as Product[];
  //   if (remoteList) set("lista", remoteList);
  // }

  return (
    <>
      <ShoppingListProvider>
        <Typography variant="h4" component={"h1"} textAlign={"center"}>
          Lista de Compras
        </Typography>
        <ShoppingList />
        <EditProduct />
        <AddItem />
        {/* <Button onClick={saveValues}>Salvar lista</Button> */}
        {/* <Button onClick={loadList}>Carregar lista</Button> */}
      </ShoppingListProvider>
    </>
  );
}
