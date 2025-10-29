import {
  extendConfig,
  extendTheme,
  type ThemeConfig,
  type UsageTheme,
} from "@yamada-ui/react";

const theme: UsageTheme = {
  fonts: {
    heading: `"Hachi Maru Pop", cursive`,
    body: `"Hachi Maru Pop", cursive`,
  },
  components: {
    Text: {
      defaultProps: {
        marginBlockStart: "-0.2em",
      },
    },
    Heading: {
      defaultProps: {
        marginBlockStart: "-0.2em",
      },
    },
    Switch: {
      baseStyle: {
        label: {
          marginBlockStart: "-0.2em",
        },
      },
    },
  },
};

export const customTheme = extendTheme(theme)();

const config: ThemeConfig = {
  initialColorMode: "system",
};

export const customConfig = extendConfig(config);
