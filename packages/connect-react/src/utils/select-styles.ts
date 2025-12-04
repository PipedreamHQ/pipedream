import type { CSSObjectWithLabel, GroupBase, StylesConfig } from "react-select";
import type { Shadows } from "../theme";

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
