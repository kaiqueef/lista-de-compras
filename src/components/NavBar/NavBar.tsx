import { ArrowBack } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { ReactNode, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";
import { useLocalStorage } from "@/hooks/useLocalStorage.hook";
import { toast } from "react-toastify";
import getShoppingContext from "@/context/getShoppingContext";
import getRecipeContext from "@/context/getRecipeContext";
import getRankingContext from "@/context/getRankingContext";
import { REMOTE_LIST_ID_KEY } from "@/services/remoteSync";
import { NavBarOption } from "./styles";
import { Ranking, Recipes, ShoppingCart } from "../Icons";

export function NavBar({
  title,
  icon,
}: {
  title?: string;
  icon?: ReactNode | null;
}) {
  const { page, loadRemoteList: loadRemoteShoppingList } = getShoppingContext();
  const { loadRemoteList: loadRemoteRecipes } = getRecipeContext();
  const { loadRemoteList: loadRemoteRankings } = getRankingContext();

  const [openMenuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [openLoadList, setOpenLoadList] = useState(false);
  const [listName, setListName] = useState("");

  const { get, set, remove } = useLocalStorage();

  const router = useRouter();

  const handleMenu = (event: any) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleClickAway = (event: any) => {
    if (openMenuAnchorEl && !openMenuAnchorEl.contains(event.target as Node)) {
      setMenuAnchorEl(null);
    }
  };

  function closeModal() {
    setOpenLoadList(false);
  }
  function openModal() {
    setOpenLoadList(true);
  }

  async function handleConfirmLoadList() {
    set(REMOTE_LIST_ID_KEY, listName.trim());
    router.push("/");
    setListName("");
    closeModal();

    const results = await Promise.all([
      loadRemoteShoppingList(),
      loadRemoteRecipes(),
      loadRemoteRankings(),
    ]);
    if (results.includes("error")) return; // o erro já foi mostrado
    if (results.includes("loaded")) toast.success("Lista Remota Carregada!");
    else toast.info("Lista Remota Criada!");
  }
  const currentRemoteList = get(REMOTE_LIST_ID_KEY);

  function _changePage(page: string) {
    router.push(page);
    closeMenu();
  }

  function desvincular() {
    remove(REMOTE_LIST_ID_KEY);
    closeMenu();
  }

  return (
    <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
      <AppBar
        position="static"
        sx={{ background: "#212331", boxShadow: "none" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            sx={{ padding: 0, minWidth: 0 }}
            disabled={router.pathname === "/"}
            onClick={() => router.back()}
          >
            <ArrowBack />
          </Button>
          <Typography variant="h5" component={"h1"} textAlign={"center"}>
            {title ? title : page.title}
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {currentRemoteList && (
        <Typography variant="caption" textAlign={"center"} mb={1}>
          Lista atual: <b>{currentRemoteList}</b>
        </Typography>
      )}
      {icon ? (
        icon
      ) : (
        <Stack
          sx={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <NavBarOption
            onClick={() => page.set("rankings")}
            className={page.current === "rankings" ? "active" : ""}
          >
            <Ranking />
          </NavBarOption>

          <NavBarOption
            onClick={() => page.set("shopping")}
            className={page.current === "shopping" ? "active" : ""}
          >
            <ShoppingCart />
          </NavBarOption>
          <NavBarOption
            onClick={() => page.set("recipes")}
            className={page.current === "recipes" ? "active" : ""}
          >
            <Recipes />
          </NavBarOption>
        </Stack>
      )}
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box>
          <Menu
            id="menu-appbar"
            anchorEl={openMenuAnchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(openMenuAnchorEl)}
            onClose={closeMenu}
          >
            <MenuItem onClick={() => _changePage("/")}>Compras</MenuItem>
            {currentRemoteList ? (
              <MenuItem onClick={desvincular}>Desvincular lista</MenuItem>
            ) : (
              <MenuItem onClick={openModal}>Carregar lista</MenuItem>
            )}
          </Menu>
        </Box>
      </ClickAwayListener>
      <Dialog open={openLoadList} onClose={closeModal} sx={{ height: "100vh" }}>
        <DialogTitle>Carregar Lista</DialogTitle>
        <DialogContent>
          <TextField
            placeholder="Nome da Lista"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          ></TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal}>Cancelar</Button>
          <Button disabled={!listName.trim()} onClick={handleConfirmLoadList}>
            Carregar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
