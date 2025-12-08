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
 * Resolves theme colors for select components.
 * Uses theme colors directly - no dark/light mode fallbacks needed
 * since the theme itself defines the appropriate colors.
 */
export function resolveSelectColors(colors: Partial<Colors>): SelectColorConfig & { appIconBg: string } {
  // Use theme colors directly - these are already correct for the current mode
  const surface = colors.neutral0 ?? "#ffffff";
  const border = colors.neutral20 ?? "hsl(0, 0%, 80%)";
  const text = colors.neutral60 ?? "hsl(0, 0%, 40%)";
  const textStrong = colors.neutral80 ?? "hsl(0, 0%, 20%)";

  // For hover/selected, use custom colors if provided, otherwise use theme colors
  // neutral20 works for hover in both light (darker than surface) and dark (lighter than surface) modes
  const hoverBg = colors.optionHover ?? colors.neutral20 ?? "hsl(0, 0%, 80%)";
  // For selected state, use neutral30 (slightly more contrast than hover) for better visibility
  const selectedBg = colors.optionSelected ?? colors.neutral30 ?? "hsl(0, 0%, 70%)";
  const selectedHoverBg = colors.optionSelectedHover ?? colors.neutral40 ?? "hsl(0, 0%, 60%)";
  const appIconBg = colors.appIconBackground ?? colors.neutral0 ?? "#ffffff";

  return {
    surface,
    border,
    text,
    textStrong,
    hoverBg,
    selectedBg,
    selectedHoverBg,
    appIconBg,
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
    menuList: (base: CSSObjectWithLabel) => ({
      ...base,
      backgroundColor: surface,
    }),
    singleValue: (base: CSSObjectWithLabel) => ({
      ...base,
      color: text,
      fontSize: "0.875rem",
    }),
    input: (base: CSSObjectWithLabel) => ({
      ...base,
      color: text,
      fontSize: "0.875rem",
    }),
    option: (
      base: CSSObjectWithLabel,
      state: { isSelected: boolean; isFocused: boolean; isDisabled: boolean },
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
        fontSize: "0.875rem",
        // Override the :active state to use our colors instead of default blue
        ":active": {
          ...base[":active"],
          backgroundColor: state.isDisabled ? undefined : selectedHoverBg,
        },
      };
    },
  };
}
