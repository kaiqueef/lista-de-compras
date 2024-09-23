import { useEffect } from "react";
import "../styles/global.css";
import { AppProps } from "next/app";
import { ShoppingListProvider } from "@/context/shoppingListContext";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log(
              "Service Worker registered with scope:",
              registration.scope
            );
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }
  }, []);

  return (
    <ShoppingListProvider>
      <Component {...pageProps} />;
    </ShoppingListProvider>
  );
}

export default MyApp;
