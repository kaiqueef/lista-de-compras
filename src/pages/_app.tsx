import { useEffect } from "react";
import "../styles/global.css";
import { AppProps } from "next/app";
import { ShoppingListProvider } from "@/context/shoppingListContext";
import { ThemeProvider } from "@emotion/react";
import { muiTheme } from "@/styles/mui-theme";
import { ToastContainer } from "react-toastify";
import { Flip } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

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
    <ThemeProvider theme={muiTheme}>
      <ShoppingListProvider>
        <Component {...pageProps} />
      </ShoppingListProvider>

      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={1000}
        hideProgressBar
        closeOnClick
        transition={Flip}
      />
    </ThemeProvider>
  );
}

export default MyApp;
