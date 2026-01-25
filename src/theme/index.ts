import { defineTheme, extendConfig, extendTheme } from "@yamada-ui/react";

// v2ではcomponentsプロパティは削除されたため、テーマのカスタマイズはより簡素に
const theme = defineTheme({
  fonts: {
    heading: `"Hachi Maru Pop", cursive`,
    body: `"Hachi Maru Pop", cursive`,
  },
});

export const customTheme = extendTheme(theme);

export const customConfig = extendConfig({});
