import {
  createContext, useContext, type ReactNode,
} from "react";
import type {
  ComponentProps, CSSProperties, JSXElementConstructor,
} from "react";
import {
  components as ReactSelectComponents, mergeStyles as mergeReactSelectStyles,
} from "react-select";
import type {
  ClassNamesConfig as ReactSelectClassNamesConfig,
  GroupBase,
  Props as ReactSelectCustomizationProps,
  SelectComponentsConfig as ReactSelectComponentsConfig,
  StylesConfig as ReactSelectStylesConfig,
  Theme as ReactSelectTheme,
} from "react-select";
import type { ConfigurableProp } from "@pipedream/sdk";
import {
  defaultTheme, getReactSelectTheme, mergeTheme, unstyledTheme, type CustomThemeConfig, type Theme,
} from "../theme";
import type { FormFieldContext } from "./form-field-context";

import { ComponentForm } from "../components/ComponentForm";
import { ControlAny } from "../components/ControlAny";
import { ControlApp } from "../components/ControlApp";
import { ControlBoolean } from "../components/ControlBoolean";
import { ControlInput } from "../components/ControlInput";
import { ControlSelect } from "../components/ControlSelect";
import { ControlSubmit } from "../components/ControlSubmit";
import { Description } from "../components/Description";
import { Errors } from "../components/Errors";
import { Field } from "../components/Field";
import { Label } from "../components/Label";
import { OptionalFieldButton } from "../components/OptionalFieldButton";
import { LoadMoreButton } from "../components/LoadMoreButton";

export const defaultComponents = {
  Description,
  Errors,
  Label,
  OptionalFieldButton,
  Button: LoadMoreButton,
};

export type ReactSelectComponents = {
  controlAppSelect: typeof ControlApp;
  controlSelect: typeof ControlSelect;
};

export type CustomComponents<Option, IsMulti extends boolean, Group extends GroupBase<Option>> = {
  [K in keyof typeof defaultComponents]: typeof defaultComponents[K]
} & {
  [K in keyof ReactSelectComponents]: ReactSelectComponentsConfig<Option, IsMulti, Group>
};

export type ComponentLibrary = typeof defaultComponents;
export type CustomComponentsConfig<T, U extends boolean, V extends GroupBase<T>> = Partial<CustomComponents<T, U, V>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CustomizationOpts<P extends ComponentProps<JSXElementConstructor<any>>> = P & {
  theme: Theme;
};

export type CustomizableProps = {
  componentForm: ComponentProps<typeof ComponentForm>;
  connectButton: ComponentProps<typeof ControlApp> & FormFieldContext<ConfigurableProp>;
  controlAny: ComponentProps<typeof ControlAny> & FormFieldContext<ConfigurableProp>;
  controlApp: ComponentProps<typeof ControlApp> & FormFieldContext<ConfigurableProp>;
  controlBoolean: ComponentProps<typeof ControlBoolean> & FormFieldContext<ConfigurableProp>;
  controlInput: ComponentProps<typeof ControlInput> & FormFieldContext<ConfigurableProp>;
  controlSubmit: ComponentProps<typeof ControlSubmit>;
  description: ComponentProps<typeof Description>;
  error: ComponentProps<typeof Errors>;
  errors: ComponentProps<typeof Errors>;
  field: ComponentProps<typeof Field>;
  heading: ComponentProps<typeof ComponentForm>;
  label: ComponentProps<typeof Label>;
  optionalFields: ComponentProps<typeof ComponentForm>;
  optionalFieldButton: ComponentProps<typeof OptionalFieldButton>;
  loadMoreButton: ComponentProps<typeof LoadMoreButton>;
};

export type CustomClassNamesFn<K extends keyof CustomizableProps> = ((opts: CustomizationOpts<CustomizableProps[K]>) => string);
export type CustomClassNamesConfig = {
  [K in keyof CustomizableProps]?: string | CustomClassNamesFn<K>
} & {
  [K in keyof ReactSelectComponents]?: ReactSelectClassNamesConfig
};

export type CustomStylesFn<K extends keyof CustomizableProps> = ((baseStyles: CSSProperties, opts: CustomizationOpts<CustomizableProps[K]>) => CSSProperties);
export type CustomStylesConfig = {
  [K in keyof Omit<CustomizableProps, "select">]?: CSSProperties | CustomStylesFn<K>
} & {
  [K in keyof ReactSelectComponents]?: ReactSelectStylesConfig
};

export type CustomizationConfig<Option, IsMulti extends boolean, Group extends GroupBase<Option>> = {
  classNames?: CustomClassNamesConfig;
  classNamePrefix?: string;
  components?: CustomComponentsConfig<Option, IsMulti, Group>;
  styles?: CustomStylesConfig;
  theme?: CustomThemeConfig;
  unstyled?: boolean;
};

export const CustomizationContext = createContext<CustomizationConfig<any, any, any>>({ // eslint-disable-line @typescript-eslint/no-explicit-any
  classNames: {},
  classNamePrefix: "",
  components: {},
  styles: {},
  theme: defaultTheme,
  unstyled: false,
});

export type CustomizationProps = {
  className: string;
  style: CSSProperties;
};
export type BaseReactSelectProps<Option, IsMulti extends boolean, Group extends GroupBase<Option>> = {
  components?: ReactSelectComponentsConfig<Option, IsMulti, Group>;
  styles?: ReactSelectStylesConfig;
};

// XXX refactor generics in this file to fix relationship between Key and other generics, etc.
export type Customization = {
  getClassNames: <Key extends keyof CustomizableProps>(name: Key, props: CustomizableProps[Key]) => string;
  getComponents: () => ComponentLibrary;
  getProps: <Key extends keyof CustomizableProps>(name: Key, baseStyles: CSSProperties, props: CustomizableProps[Key]) => CustomizationProps;
  getStyles: <Key extends keyof CustomizableProps>(name: Key, baseStyles: CSSProperties, props: CustomizableProps[Key]) => CSSProperties;
  theme: Theme;
  select: {
    getClassNamePrefix: <Key extends keyof ReactSelectComponents>(name: Key) => string;
    getClassNames: <Key extends keyof ReactSelectComponents>(name: Key) => ReactSelectClassNamesConfig;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getComponents: <Key extends keyof ReactSelectComponents>(name: Key, baseComponents?: ReactSelectComponentsConfig<any, any, any>) => ReactSelectComponentsConfig<any, any, any>;
    getStyles: <Key extends keyof ReactSelectComponents>(name: Key, baseStyles?: ReactSelectStylesConfig) => ReactSelectStylesConfig;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getProps: <Key extends keyof ReactSelectComponents>(name: Key, baseProps?: BaseReactSelectProps<any, any, any>) => ReactSelectCustomizationProps;
    theme: ReactSelectTheme;
  };
};

function createSelectCustomization(): Customization["select"] {
  const context = useContext(CustomizationContext) ?? {};
  const theme = getReactSelectTheme(context.theme ?? {});
  function getClassNamePrefix(): string {
    return context.classNamePrefix ?? "";
  }

  function getClassNames<Key extends keyof ReactSelectComponents>(name: Key): ReactSelectClassNamesConfig {
    const baseClassName = `${context?.classNamePrefix ?? "pd-"}${name}`;
    const classNames: ReactSelectClassNamesConfig = {
      ...(context.classNames?.[name] ?? {}),
    };
    if (typeof classNames?.container == "function") {
      classNames.container = typeof classNames?.container == "function"
        ? (...args) => ([
          classNames?.container?.(...args),
          baseClassName,
        ]).join(" ")
        : () => baseClassName;
    }
    return classNames;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getComponents<Key extends keyof ReactSelectComponents>(name: Key, baseComponents?: ReactSelectComponentsConfig<any, any, any>): ReactSelectComponentsConfig<any, any, any> {
    return {
      ...ReactSelectComponents,
      ...(baseComponents ?? {}),
      ...(context?.components?.[name] ?? {}),
    };
  }

  function getStyles<Key extends keyof ReactSelectComponents>(name: Key, baseStyles?: ReactSelectStylesConfig): ReactSelectStylesConfig {
    return mergeReactSelectStyles(context.styles?.[name] ?? {}, baseStyles ?? {});
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getProps<Key extends keyof ReactSelectComponents>(name: Key, baseProps?: BaseReactSelectProps<any, any, any>): ReactSelectCustomizationProps {
    return {
      classNamePrefix: getClassNamePrefix(),
      classNames: getClassNames(name),
      components: getComponents(name, baseProps?.components),
      styles: getStyles(name, baseProps?.styles),
      theme,
    };
  }

  return {
    getClassNamePrefix,
    getClassNames,
    getComponents,
    getProps,
    getStyles,
    theme,
  };
}

export function useCustomize(): Customization {
  const context = useContext(CustomizationContext) ?? {};
  const customTheme = context.theme;
  const baseTheme = context.unstyled
    ? unstyledTheme
    : defaultTheme;
  const theme = typeof customTheme == "function"
    ? mergeTheme(baseTheme, customTheme(baseTheme))
    : mergeTheme(baseTheme, customTheme);

  function getClassNames<Key extends keyof CustomizableProps>(name: Key, props: CustomizableProps[Key]): string {
    const baseClassName = `${context?.classNamePrefix ?? "pd-"}${name.toLowerCase()}`;
    const customClassNames = context.classNames?.[name] as CustomClassNamesConfig[Key];
    if (typeof customClassNames == "function") {
      const customClassNamesFn = customClassNames as CustomClassNamesFn<Key>;

      const opts = {
        ...(props ?? {}),
        theme,
      } as CustomizationOpts<CustomizableProps[Key]>;
      return [
        baseClassName,
        customClassNamesFn(opts),
      ].filter(Boolean).join(" ");
    }
    return [
      baseClassName,
      customClassNames,
    ].filter(Boolean).join(" ");
  }

  function getComponents(): ComponentLibrary {
    return {
      ...defaultComponents,
      ...(context?.components ?? {}),
    } as ComponentLibrary;
  }

  function getStyles<Key extends keyof CustomizableProps>(name: Key, baseStyles: CSSProperties, props: CustomizableProps[Key]): CSSProperties {
    const customStyles = context.styles?.[name] as CustomStylesConfig[Key];
    if (typeof customStyles == "function") {
      const customStylesFn = customStyles as CustomStylesFn<Key>;
      const opts = {
        ...(props ?? {}),
        theme,
      } as CustomizationOpts<CustomizableProps[Key]>;
      return customStylesFn(baseStyles, opts);
    }
    if (customStyles) {
      return {
        ...baseStyles,
        ...customStyles,
      } as CSSProperties;
    }
    return baseStyles;
  }

  function getProps<Key extends keyof CustomizableProps>(name: Key, baseStyles: CSSProperties, props: CustomizableProps[Key]): CustomizationProps {
    return {
      className: getClassNames(name, props),
      style: getStyles(name, baseStyles, props),
    };
  }
  return {
    getClassNames,
    getComponents,
    getProps,
    getStyles,
    select: createSelectCustomization(),
    theme,
  };
}

export const CustomizeProvider = ({
  children,
  ...customizationProps
}: CustomizationConfig<any, any, any> & { children: ReactNode; }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return <CustomizationContext.Provider value={customizationProps}>{children}</CustomizationContext.Provider>;
};
