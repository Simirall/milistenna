import { defineTheme, extendConfig, extendTheme } from "@yamada-ui/react";
import { type FontValue, getFontFamily } from "@/store/font";

// v2ではcomponentsプロパティは削除されたため、テーマのカスタマイズはより簡素に
export const createCustomTheme = (fontValue: FontValue) => {
  const fontFamily = getFontFamily(fontValue);
  const theme = defineTheme({
    fonts: {
      body: fontFamily,
      heading: fontFamily,
    },
  });
  return extendTheme(theme);
};

export const customConfig = extendConfig({});
