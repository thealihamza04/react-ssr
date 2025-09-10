import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";

/**
 * @param {string} url
 */
export function render(url) {
      const html = renderToString(
            <StrictMode>
                  <StaticRouter location={url}>
                        <App />
                  </StaticRouter>
            </StrictMode>
      );
      return { html };
}
