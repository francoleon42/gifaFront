import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "react-redux"; 
import { store, persistor } from "./components/store/store.js";
import { PersistGate } from "redux-persist/integration/react";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}> 
      <PersistGate loading={null} persistor={persistor}> {/* Agrega PersistGate */}
        <NextUIProvider>
          <main className="dark text-foreground bg-background">
            <App />
          </main>
        </NextUIProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
