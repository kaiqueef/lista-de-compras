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
import { Product } from "@/types/Product.type";
import { RemoteStorage } from "remote-storage";

export default function NavBar({
  title = "Lista de Compras",
  icon = null,
}: {
  title?: string;
  icon?: ReactNode | null;
}) {
  const [openMenu, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openLoadList, setOpenLoadList] = useState(false);
  const [listName, setListName] = useState("");

  const { get, set, remove } = useLocalStorage();

  const router = useRouter();

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleClickAway = (event: any) => {
    if (openMenu && !openMenu.contains(event.target as Node)) {
      setAnchorEl(null);
    }
  };

  function closeModal() {
    setOpenLoadList(false);
  }
  function openModal() {
    setOpenLoadList(true);
  }
  function handleConfirmLoadList() {
    set("lista-remota", listName);
    remove("lista");
    router.push("/");
    setListName("");
    closeModal();
  }
  const currentRemoteList = get("lista-remota");

  async function saveList() {
    const remoteStorage = new RemoteStorage({ userId: currentRemoteList });
    const list: Product[] | null = get("lista");
    await remoteStorage.setItem("lista", list); //TODO:: ADICIONAR TOAST
    closeModal();
  }
  function changePage(page: string) {
    router.push(page);
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
            {title}
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
      {icon ? (
        <Box>{icon}</Box>
      ) : (
        <Image
          src="/icons/icon-192x192.png"
          width={70}
          height={70}
          alt="icon"
        />
      )}
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box>
          <Menu
            id="menu-appbar"
            anchorEl={openMenu}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(openMenu)}
            onClose={closeMenu}
          >
            <MenuItem onClick={() => changePage("/")}>Compras</MenuItem>
            <MenuItem onClick={() => changePage("/hoje")}>Hoje</MenuItem>
            <MenuItem onClick={() => changePage("/receitas")}>
              Receitas
            </MenuItem>
            <MenuItem onClick={openModal}>Carregar lista</MenuItem>
            {currentRemoteList && (
              <MenuItem onClick={saveList}>Salvar listas</MenuItem>
            )}
          </Menu>
        </Box>
      </ClickAwayListener>
      <Dialog open={openLoadList} onClose={closeModal} sx={{ height: "100vh" }}>
        <DialogTitle>
          Carregar Listas
          {currentRemoteList && (
            <DialogTitle sx={{ fontSize: 12, p: 0, opacity: 0.7 }}>
              Lista atual: <b>{currentRemoteList}</b>
            </DialogTitle>
          )}
        </DialogTitle>
        <DialogContent>
          <TextField
            placeholder="Nome da Lista"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          ></TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal}>Cancelar</Button>
          <Button disabled={!listName} onClick={handleConfirmLoadList}>
            Carregar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
