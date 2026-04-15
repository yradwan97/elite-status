import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";

import App from "./App.tsx";
import "./index.css";
import "./i18n";
import { queryClient } from "@/lib/query-client";
import { store } from "@/store";
import { initAuth } from "@/lib/initAuth.ts";
import { initLanguage } from "@/lib/initLanguage.ts";
import { clearCredentials } from "./store/slices/authSlice.ts";

window.addEventListener('auth:logout', () => {
  store.dispatch(clearCredentials())
})

initAuth();
initLanguage();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
            <Toaster position="top-center" richColors />
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);