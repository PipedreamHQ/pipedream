import {
  FormContextProvider, type FormContext,
} from "../hooks/form-context";
import type {
  ConfigurableProps,
  ConfiguredProps,
  V1Component,
} from "@pipedream/sdk";
import { InternalComponentForm } from "./InternalComponentForm";

export type ComponentFormProps<T extends ConfigurableProps, U = ConfiguredProps<T>> = {
  userId: string;
  component: V1Component<T>;
  configuredProps?: U; // XXX value?
  disableQueryDisabling?: boolean;
  propNames?: string[]; // TODO PropNames<T>
  onSubmit?: (ctx: FormContext<T>) => void | Promise<void>; // if passed, we include button
  onUpdateConfiguredProps?: (v: U) => void; // XXX onChange?
  hideOptionalProps?: boolean;
};

export function ComponentForm<T extends ConfigurableProps>(props: ComponentFormProps<T>) {
  return (
    <FormContextProvider props={props}>
      <InternalComponentForm />
    </FormContextProvider>
  );
}
