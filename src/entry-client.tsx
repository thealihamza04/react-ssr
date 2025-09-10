import "./index.css";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";

hydrateRoot(
      document.getElementById("root"),
      <StrictMode>
            <BrowserRouter>
                  <App />
            </BrowserRouter>
      </StrictMode>
);
