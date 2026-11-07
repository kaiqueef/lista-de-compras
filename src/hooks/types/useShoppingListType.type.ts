import { Product } from "@/types/Product.type";
import { RemoteLoadResult } from "@/services/remoteSync";

type useShoppingListType = {
  shoppingList: Product[] | null;
  setNewProduct: React.Dispatch<React.SetStateAction<Product | undefined>>;
  openEdit: Product | null;
  setOpenEdit: (product: Product | null) => void;
  openDialogType: "add" | "edit" | null;
  setOpenDialogType: React.Dispatch<
    React.SetStateAction<"add" | "edit" | null>
  >;
  closeModal: () => void;
  localProductList: any;
  loadRemoteList: () => Promise<RemoteLoadResult>;
  dialogConfirmText: string;
  today: boolean;
  toggleToday: () => void;
  page: {
    set: (page: "shopping" | "recipes" | "rankings") => void;
    current: "shopping" | "recipes" | "rankings";
    title: string;
  };
};

export default useShoppingListType;
