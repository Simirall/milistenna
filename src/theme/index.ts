import {
  type ThemeConfig,
  type UsageTheme,
  extendConfig,
  extendTheme,
} from "@yamada-ui/react";

const theme: UsageTheme = {
  fonts: {
    heading: `"Hachi Maru Pop", cursive`,
    body: `"Hachi Maru Pop", cursive`,
  },
};

export const customTheme = extendTheme(theme)();

const config: ThemeConfig = {
  initialColorMode: "system",
};

export const customConfig = extendConfig(config);
