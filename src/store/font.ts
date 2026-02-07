import { create } from "zustand";
import { persist } from "zustand/middleware";

export const FONT_OPTIONS = [
  { label: "Hachi Maru Pop", value: "hachi-maru-pop" },
  { label: "IBM Plex Sans JP", value: "ibm-plex-sans-jp" },
  { label: "デフォルト", value: "system" },
] as const;

export type FontValue = (typeof FONT_OPTIONS)[number]["value"];

const fontFamilyMap: Record<FontValue, string> = {
  "hachi-maru-pop": `"Hachi Maru Pop", cursive`,
  "ibm-plex-sans-jp": `"IBM Plex Sans JP", sans-serif`,
  system: `system-ui, -apple-system, sans-serif`,
};

export const getFontFamily = (value: FontValue): string => fontFamilyMap[value];

type FontState = {
  fontValue: FontValue;
};

type FontActions = {
  setFont: (value: FontValue) => void;
};

export const useFontStore = create<FontState & FontActions>()(
  persist(
    (set) => ({
      fontValue: "hachi-maru-pop",
      setFont: (value) => set({ fontValue: value }),
    }),
    { name: "font" },
  ),
);
