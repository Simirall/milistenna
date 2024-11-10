import { UIProvider, getColorModeScript } from "@yamada-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Router } from "./Router.tsx";
import { customConfig, customTheme } from "./theme/index.ts";

const injectColorModeScript = () => {
  const scriptContent = getColorModeScript({
    initialColorMode: customConfig.initialColorMode,
  });

  const script = document.createElement("script");

  script.textContent = scriptContent;

  document.head.appendChild(script);
};

injectColorModeScript();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UIProvider config={customConfig} theme={customTheme}>
      <Router />
    </UIProvider>
  </StrictMode>,
);
