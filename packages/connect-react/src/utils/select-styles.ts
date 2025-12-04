import type {
  CSSObjectWithLabel, GroupBase, StylesConfig,
} from "react-select";
import type {
  Colors, Shadows,
} from "../theme";

export type SelectColorConfig = {
  surface: string;
  border: string;
  text: string;
  textStrong: string;
  hoverBg: string;
  selectedBg: string;
  selectedHoverBg: string;
};

export type SelectStyleConfig = {
  colors: SelectColorConfig;
  boxShadow: Shadows;
};

/**
 * Resolves theme colors with fallbacks for dark mode styling.
 * Returns the theme value if defined, otherwise the fallback.
 */
export function resolveSelectColors(colors: Partial<Colors>): SelectColorConfig & { appIconBg: string } {
  const resolve = <K extends keyof Colors>(key: K, fallback: string): string => {
    const current = colors[key];
    return current !== undefined ? current : fallback;
  };

  return {
    surface: resolve("neutral0", "#18181b"),
    border: resolve("neutral20", "rgba(255,255,255,0.16)"),
    text: resolve("neutral80", "#a1a1aa"),
    textStrong: resolve("neutral90", "#e4e4e7"),
    hoverBg: resolve("optionHover", "#27272a"),
    selectedBg: resolve("optionSelected", "rgba(59,130,246,0.2)"),
    selectedHoverBg: resolve("optionSelectedHover", "rgba(59,130,246,0.35)"),
    appIconBg: resolve("appIconBackground", "#fff"),
  };
}

/**
 * Creates base styles for react-select components with dark mode support.
 * Shared across SelectApp, SelectComponent, and ControlApp.
 */
export function createBaseSelectStyles<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(config: SelectStyleConfig): StylesConfig<Option, IsMulti, Group> {
  const {
    colors: {
      surface,
      border,
      text,
      textStrong,
      hoverBg,
      selectedBg,
      selectedHoverBg,
    },
    boxShadow,
  } = config;

  return {
    control: (base: CSSObjectWithLabel) => ({
      ...base,
      backgroundColor: surface,
      borderColor: border,
      color: text,
      boxShadow: boxShadow.input,
    }),
    menu: (base: CSSObjectWithLabel) => ({
      ...base,
      backgroundColor: surface,
      boxShadow: boxShadow.dropdown,
    }),
    singleValue: (base: CSSObjectWithLabel) => ({
      ...base,
      color: text,
    }),
    input: (base: CSSObjectWithLabel) => ({
      ...base,
      color: text,
    }),
    option: (
      base: CSSObjectWithLabel,
      state: { isSelected: boolean; isFocused: boolean },
    ) => {
      let bg = surface;
      if (state.isSelected && state.isFocused) {
        bg = selectedHoverBg;
      } else if (state.isSelected) {
        bg = selectedBg;
      } else if (state.isFocused) {
        bg = hoverBg;
      }
      return {
        ...base,
        backgroundColor: bg,
        color: textStrong,
      };
    },
  };
}
