import {
  FormContextProvider, type FormContext,
} from "../hooks/form-context";
import { DynamicProps } from "../types";
import type {
  ConfigurableProps,
  ConfiguredProps,
  V1Component,
} from "@pipedream/sdk";
import { InternalComponentForm } from "./InternalComponentForm";

export type ComponentFormProps<T extends ConfigurableProps, U = ConfiguredProps<T>> = {
  /**
   * Your end user ID, for whom you're configuring the component.
   */
  externalUserId?: string;
  /**
   * @deprecated Use `externalUserId` instead.
   */
  userId?: string;
  component: V1Component<T>;
  configuredProps?: U; // XXX value?
  disableQueryDisabling?: boolean;
  // dynamicPropsId?: string // XXX need to load this initially when passed
  propNames?: string[]; // TODO PropNames<T>
  onSubmit?: (ctx: FormContext<T>) => void | Promise<void>; // if passed, we include button
  onUpdateConfiguredProps?: (v: U) => void; // XXX onChange?
  onUpdateDynamicProps?: (dp: DynamicProps) => void;
  hideOptionalProps?: boolean;
  sdkResponse?: U;
  enableDebugging?: boolean;
  /**
   * OAuth app ID configuration for specific apps.
   * Maps app name slugs to their corresponding OAuth app IDs.
   * Example: { 'github': 'oa_xxxxxxx', 'google_sheets': 'oa_xxxxxxx' }
   */
  oauthAppConfig?: Record<string, string>;
} & (
    | { externalUserId: string; userId?: never }
    | { userId: string; externalUserId?: never }
  );

export function ComponentForm<T extends ConfigurableProps>(props: ComponentFormProps<T>) {
  return (
    <FormContextProvider props={props}>
      <InternalComponentForm />
    </FormContextProvider>
  );
}
