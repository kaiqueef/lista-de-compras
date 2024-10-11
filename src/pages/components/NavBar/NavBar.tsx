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
import { toast } from "react-toastify";

export default function NavBar({
  title = "Lista de Compras",
  icon = null,
}: {
  title?: string;
  icon?: ReactNode | null;
}) {
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
    set("lista-remota", listName);
    const remoteStorage = new RemoteStorage({ userId: listName });
    const remoteList = await remoteStorage.getItem("lista");
    if (remoteList) {
      remove("lista");
      toast.success("Lista Remota Carregada!");
    } else toast.info("Lista Remota Criada!");
    router.push("/");
    setListName("");
    closeModal();
  }
  const currentRemoteList = get("lista-remota");

  function changePage(page: string) {
    router.push(page);
    closeMenu();
  }

  function desvincular() {
    remove("lista-remota");
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

      {currentRemoteList && (
        <Typography variant="caption" textAlign={"center"}>
          Lista atual: <b>{currentRemoteList}</b>
        </Typography>
      )}
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
            <MenuItem onClick={() => changePage("/")}>Compras</MenuItem>
            <MenuItem onClick={() => changePage("/hoje")}>Hoje</MenuItem>
            <MenuItem onClick={() => changePage("/receitas")}>
              Receitas
            </MenuItem>
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
          <Button disabled={!listName} onClick={handleConfirmLoadList}>
            Carregar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
