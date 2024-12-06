import {
  createContext, useContext,
} from "react";
import type {
  AppResponse, ConfigurableProp, ConfigurablePropApp, PropValue,
} from "@pipedream/sdk";

export type FormFieldContextExtra<T extends ConfigurableProp> = T extends ConfigurablePropApp ? {
  app?: AppResponse;
} : Record<string, never>;

export type FormFieldContext<T extends ConfigurableProp> = {
  id: string;
  prop: T;
  idx: number;
  value: PropValue<T["type"]> | undefined;
  onChange: (value: PropValue<T["type"]> | undefined) => void;
  extra: FormFieldContextExtra<T>;
};

export const FormFieldContext = createContext<FormFieldContext<any /* XXX fix */> | undefined>(undefined); // eslint-disable-line @typescript-eslint/no-explicit-any

export const useFormFieldContext = <T extends ConfigurableProp>() => {
  const context = useContext(FormFieldContext);

  if (!context) {
    throw new Error("Must be used inside FormFieldContext.Provider");
  }

  return context as FormFieldContext<T>;
};
