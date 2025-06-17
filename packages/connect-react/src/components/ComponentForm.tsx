import {
  DynamicProps,
  FormContextProvider, type FormContext,
} from "../hooks/form-context";
import type {
  ConfigurableProps,
  ConfiguredProps,
  V1Component,
} from "@pipedream/sdk";
import { InternalComponentForm } from "./InternalComponentForm";
import { OAuthAppProvider } from "../hooks/oauth-app-context";

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
  onUpdateDynamicProps?: (dp: DynamicProps<T>) => void;
  hideOptionalProps?: boolean;
  sdkResponse?: unknown | undefined;
  enableDebugging?: boolean;
  /**
   * Optional OAuth app ID for app-specific account connections
   */
  oauthAppId?: string;
};

export function ComponentForm<T extends ConfigurableProps>(props: ComponentFormProps<T>) {
  const {
    oauthAppId, ...formProps
  } = props;

  return (
    <OAuthAppProvider oauthAppId={oauthAppId}>
      <FormContextProvider props={formProps}>
        <InternalComponentForm />
      </FormContextProvider>
    </OAuthAppProvider>
  );
}
