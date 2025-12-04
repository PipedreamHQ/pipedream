import {
  defaultTheme as _reactSelectDefaultTheme,
  type Theme as ReactSelectTheme,
} from "react-select";

const reactSelectDefaultTheme = _reactSelectDefaultTheme as Theme;

export type Colors = {
  // select.control:boxShadow
  // select.control:focused:borderColor
  // select.control:hover:focused:borderColor
  // select.option:active:selected:backgroundColor
  // select.option:selected:backgroundColor
  primary: string;
  primary75: string;
  // select.option:active:not(selected):backgroundColor
  primary50: string;
  // select.option:focused:backgroundColor
  primary25: string;

  // select.multiValueRemove:hover:color
  danger: string;
  // select.multiValueRemove:focused:backgroundColor
  // select.multiValueRemove:hover:backgroundColor
  dangerLight: string;

  // select.control:backgroundColor
  // select.menu:backgroundColor
  // select.multiValue:backgroundColor
  // select.option:selected:color
  neutral0: string;
  // select.control:disabled:backgroundColor
  neutral5: string;
  // select.control:disabled:borderColor
  // select.indicatorSeparator:disabled:backgroundColor
  neutral10: string;
  // select.control:borderColor
  // select.indicatorContainer:color
  // select.indicatorSeparator:backgroundColor
  // select.loadingIndicator:color
  // select.option:disabled:color
  neutral20: string;
  // select.control:hover:not(focused):borderColor
  neutral30: string;
  // select.groupHeading:color
  // select.indicatorContainer:hover:not(focused):color
  // select.notice:color
  // select.singleValue:disabled:color
  neutral40: string;
  // select.placeholder:color
  neutral50: string;
  // select.indicatorContainer:focused:color
  // select.loadingIndicator:focused:color
  neutral60: string;
  neutral70: string;
  // select.indicatorContainer:hover:focused:color
  // select.input:color
  // select.multiValueLabel:color
  // select.singleValue:color
  neutral80: string;
  neutral90: string;

  // Option state backgrounds (dark mode friendly)
  // select.option:hover:backgroundColor
  optionHover?: string;
  // select.option:selected:backgroundColor
  optionSelected?: string;
  // select.option:selected:hover:backgroundColor
  optionSelectedHover?: string;
};

export type Shadows = {
  button: string;
  input: string;
  card: string;
  dropdown: string;
};

export type ThemeSpacing = {
  baseUnit: number;
  // The minimum height of the control
  controlHeight: number;
  // The amount of space between the control and menu
  menuGutter: number;
};

export type Theme = {
  borderRadius?: number | string;
  colors: Partial<Colors>;
  spacing: ThemeSpacing;
  boxShadow: Shadows;
};

export type PartialTheme = {
  borderRadius?: Theme["borderRadius"];
  colors?: Partial<Colors>;
  spacing?: Partial<ThemeSpacing>;
  boxShadow?: Partial<Shadows>;
};

export type CustomThemeConfig = PartialTheme | ((theme: Theme) => PartialTheme);

export const defaultTheme: Theme = {
  borderRadius: 4,
  colors: {
    primary: "#2684FF",
    primary75: "#4C9AFF",
    primary50: "#B2D4FF",
    primary25: "#DEEBFF",

    danger: "#DE350B",
    dangerLight: "#FFBDAD",

    neutral0: "hsl(0, 0%, 100%)",
    neutral5: "hsl(0, 0%, 95%)",
    neutral10: "hsl(0, 0%, 90%)",
    neutral20: "hsl(0, 0%, 80%)",
    neutral30: "hsl(0, 0%, 70%)",
    neutral40: "hsl(0, 0%, 60%)",
    neutral50: "hsl(0, 0%, 50%)",
    neutral60: "hsl(0, 0%, 40%)",
    neutral70: "hsl(0, 0%, 30%)",
    neutral80: "hsl(0, 0%, 20%)",
    neutral90: "hsl(0, 0%, 10%)",
  },
  boxShadow: {
    button:
      "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px",
    card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    dropdown:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    input: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  },
  spacing: {
    baseUnit: 4,
    controlHeight: 32,
    menuGutter: 8,
  },
};

export const unstyledTheme: Theme = {
  colors: {},
  spacing: {
    baseUnit: 4,
    controlHeight: 32,
    menuGutter: 8,
  },
  boxShadow: {
    button: "none",
    input: "none",
    card: "none",
    dropdown: "none",
  },
};

export function getReactSelectTheme(
  theme: CustomThemeConfig | undefined,
): ReactSelectTheme {
  if (!theme) return _reactSelectDefaultTheme;
  const _theme = typeof theme == "function"
    ? theme(defaultTheme)
    : theme;
  const {
    colors, spacing, borderRadius,
  } = mergeTheme(
    reactSelectDefaultTheme,
    _theme,
  );
  return {
    borderRadius,
    colors,
    spacing,
  } as ReactSelectTheme;
}

export function mergeTheme(
  target: Theme,
  ...sources: (PartialTheme | undefined)[]
): Theme {
  const merged = {
    borderRadius: target.borderRadius,
    colors: {
      ...target.colors,
    },
    spacing: {
      ...target.spacing,
    },
    boxShadow: {
      ...target.boxShadow,
    },
  };
  for (const source of sources) {
    if (!source) continue;
    merged.borderRadius = source.borderRadius ?? merged.borderRadius;
    Object.assign(merged.boxShadow, source.boxShadow);
    Object.assign(merged.colors, source.colors);
    Object.assign(merged.spacing, source.spacing);
  }
  return merged;
}
