# Pipedream Connect-React

> This package is actively maintained and is continuing to expand supported capabilities and overall developer experience.
>
> Please join [our community](https://pipedream.com/support) or reach out to `connect@pipedream.com` with feedback.

## Installation and usage

```sh
% npm install --save @pipedream/connect-react
```

Then use the `ComponentFormContainer` component in your app (see below for props
and customization).

> [!NOTE]
> To run the example below, set the following environment variables in `.env.local`.
>
> `PIPEDREAM_ALLOWED_ORIGINS`
>
> Make sure this matches the origin of your app, e.g.
>
> ```sh
> # One domain — note the array
> PIPEDREAM_ALLOWED_ORIGINS=["https://example.com"]
>
> # Multiple domains
> PIPEDREAM_ALLOWED_ORIGINS=["https://example.com", "http://localhost:3000"]
> ```
>
> `PIPEDREAM_CLIENT_ID`
>
> Create a [Pipedream API OAuth client](https://pipedream.com/docs/rest-api/auth#creating-an-oauth-client) and enter its client ID here.
>
> `PIPEDREAM_CLIENT_SECRET`
>
> Your OAuth client secret. **This is a secret, and should not be exposed to your frontend**.
>
> `PIPEDREAM_PROJECT_ID`
>
> [Create a Pipedream project](https://pipedream.com/projects) and [copy its ID](https://pipedream.com/docs/projects#finding-your-projects-id).

```typescript
/* actions.ts */
"use server";
import { createBackendClient } from "@pipedream/sdk/server";

const {
  NODE_ENV,
  PIPEDREAM_ALLOWED_ORIGINS,
  PIPEDREAM_CLIENT_ID,
  PIPEDREAM_CLIENT_SECRET,
  PIPEDREAM_PROJECT_ID,
} = process.env;

const allowedOrigins = JSON.parse(PIPEDREAM_ALLOWED_ORIGINS || "[]");

const client = createBackendClient({
  environment: NODE_ENV,
  projectId: PIPEDREAM_PROJECT_ID,
  credentials: {
    clientId: PIPEDREAM_CLIENT_ID,
    clientSecret: PIPEDREAM_CLIENT_SECRET,
  },
});

export async function fetchToken(opts: { externalUserId: string }) {
  return await client.createConnectToken({
    external_user_id: opts.externalUserId,
    allowed_origins: PIPEDREAM_ALLOWED_ORIGINS,
  });
}

/* page.tsx */
"use client";
import { useState } from "react";
import { createFrontendClient } from "@pipedream/sdk/browser";
import {
  ComponentFormContainer,
  FrontendClientProvider,
} from "@pipedream/connect-react";
import { fetchToken } from "./actions";

export default function Page() {
  // https://pipedream.com/docs/connect/api#external-users
  const userId = "my-authed-user-id";
  const client = createFrontendClient({
    environment: "development",
    externalUserId: userId,
    tokenCallback: fetchToken,
  });
  const [configuredProps, setConfiguredProps] = useState({
    text: "hello slack!",
  });
  return (
    <>
      <div>My application</div>
      <FrontendClientProvider client={client}>
        <ComponentFormContainer
          userId={userId}
          componentKey="slack-send-message"
          configuredProps={configuredProps}
          onUpdateConfiguredProps={setConfiguredProps}
        />
      </FrontendClientProvider>
    </>
  );
}
```

## Components and Props

### `FrontendClientProvider`

Necessary wrapper to provide the frontend client to other components.

```typescript
type Props = {
  client: typeof import("@pipedream/sdk/browser").createFrontendClient;
};
```

### `ComponentFormContainer`

Loader component for `ComponentForm`.

```typescript
type ComponentFormContainerProps = {
  /** action (or trigger) to look up in the [Pipedream Registry](https://github.com/PipedreamHQ/pipedream/tree/master/components) */
  componentKey: string;
} & Omit<ComponentFormProps, "component">; // see below
```

### `ComponentForm`

```typescript
type ComponentFormProps = {
  component: typeof import("@pipedream/sdk").V1Component;
  /** External user configuring the form */
  userId: string;
  /** Form configured values */
  configuredProps?: Record<string, any>;
  /** Filtering configurable props */
  propNames?: string[];
  /** Shows submit button + callback when clicked */
  onSubmit: (ctx: FormContext) => Awaitable<void>;
  /** To control and store configured values on form updates, can be used to call actionRun or triggerDeploy */
  onUpdateConfiguredProps: (v: Record<string, any>) => void;
  /** Hide optional props section */
  hideOptionalProps: boolean;
  /** SDK response payload. Used in conjunction with enableDebugging to
   * show errors in the form. */
  sdkResponse: unknown[] | unknown | undefined;
  /** Whether to show show errors in the form. Requires sdkErrors to be set. */
  enableDebugging?: boolean;
  /** OAuth app ID configuration for specific apps.
   * Maps app name slugs to their corresponding OAuth app IDs. */
  oauthAppConfig?: Record<string, string>;
};
```

### OAuth App Configuration

To connect to an OAuth app using your own OAuth client, you can specify custom OAuth app IDs for each app using the `oauthAppConfig` prop:

```tsx
const oauthAppConfig = {
  github: "oa_xxxxxxx",
  google_sheets: "oa_xxxxxxx",
  slack: "oa_xxxxxxx",
};

<ComponentFormContainer
  userId={userId}
  componentKey="slack-send-message-to-channel"
  configuredProps={configuredProps}
  onUpdateConfiguredProps={setConfiguredProps}
  oauthAppConfig={oauthAppConfig}
/>;
```

This allows you to use your own OAuth applications for specific integrations, providing better control over branding and permissions. Read how to configure OAuth clients in Pipedream here: [https://pipedream.com/docs/connect/managed-auth/oauth-clients](https://pipedream.com/docs/connect/managed-auth/oauth-clients).

**Note**: OAuth app IDs are not sensitive, and are safe to expose in the client.

### App Sorting and Filtering

When using the `SelectApp` component or `useApps` hook, you can control how apps are sorted and filtered:

```tsx
<SelectApp
  value={selectedApp}
  onChange={setSelectedApp}
  appsOptions={{
    sortKey: "featured_weight", // Sort by: "name" | "featured_weight" | "name_slug"
    sortDirection: "desc", // "asc" | "desc"
    hasActions: true, // Only show apps with actions
    hasTriggers: false, // Exclude apps with triggers
  }}
/>
```

The `useApps` hook accepts the same options:

```tsx
const { apps, isLoading } = useApps({
  q: "slack", // Search query
  sortKey: "featured_weight",
  sortDirection: "desc",
  hasActions: true,
});
```

## Customization

Style individual components using the `CustomizeProvider` and a `CustomizationConfig`.

```tsx
<FrontendClientProvider client={client}>
  <CustomizeProvider {...customizationConfig}>
    <ComponentFormContainer
      key="slack-send-message-to-channel"
      configuredProps={configuredProps}
      onUpdateConfiguredProps={setConfiguredProps}
    />
  </CustomizeProvider>
</FrontendClientProvider>
```

```typescript
type CustomizationConfig = {
  classNames?: CustomClassNamesConfig;
  classNamePrefix?: string;
  components?: CustomComponentsConfig;
  styles?: CustomStylesConfig;
  theme?: CustomThemeConfig;
  unstyled?: boolean;
};
```

### The `classNames` prop

Not to be confused with the `className` prop, `classNames` takes an object with
keys to represent the inner components of a `ComponentForm`. Each inner
component takes a callback function with the following signature:

```tsx
<CustomizeProvider
  classNames={{
    controlInput: ({ prop }) =>
      prop.type === "number" ? "border-red-600" : "border-blue-600",
  }}
/>
```

#### Note on CSS specificity

If you're using the `classNames` API and you're trying to override some base
styles with the same level of specificity, you must ensure that your provided
styles are declared later than the styles from `@pipedream/connect-react`
(e.g. the link or style tag in the head of your HTML document) in order for them
to take precedence.

### The `classNamePrefix` prop

If you provide the `classNamePrefix` prop, all inner elements will be given a
`className` with the provided prefix.

### The `components` prop

You can rewrite individual inner components with the `components` prop. If you
want to respect other customizations, such as `styles`, `classNames` or `theme`,
use the `useCustomize` hook to integrate your base styles with the customization
framework.

In this example, we're replacing the default `Label` inner component with a version
that adds a checkmark to highlight required props.

```tsx
import type { CSSProperties } from "react";
import type { ConfigurableProp, LabelProps } from "@pipedream/connect-react";
import { useCustomize } from "@pipedream/connect-react";

export function CustomLabel<T extends ConfigurableProp>(props: LabelProps<T>) {
  const { text, field } = props;
  const { id } = field;

  const { getProps, theme } = useCustomize();

  const baseStyles: CSSProperties = {
    color: theme.colors.neutral90,
    fontWeight: 450,
    gridArea: "label",
    textTransform: "capitalize",
    lineHeight: "1.5",
  };

  const required =
    !field.prop.optional && !["alert", "app"].includes(field.prop.type) ? (
      field.prop.type == "boolean" ? (
        typeof field.value != "undefined"
      ) : !!field.value ? (
        <span
          style={{ color: "#12b825", fontSize: "small", marginLeft: "0.5rem" }}
        >
          {" "}
          ✓
        </span>
      ) : (
        <span
          style={{ color: "#d0d0d0", fontSize: "small", marginLeft: "0.5rem" }}
        >
          {" "}
          ✓
        </span>
      )
    ) : (
      ""
    );
  return (
    <label htmlFor={id} {...getProps("label", baseStyles, props)}>
      {text}
      {required}
    </label>
  );
}
```

Then we apply the custom component using `CustomizeProvider`.

```tsx
import { CustomLabel } from "./CustomLabel";

<CustomizeProvider
  components={{
    Label: CustomLabel,
  }}
/>;
```

### The `styles` prop

The recommended way to provide custom styles is to use the `styles` prop. Each inner
component takes either a CSSProperties object or a callback function with the following
signature:

```tsx
<CustomizeProvider
  styles={{
    label: { fontSize: "80%" },
    controlInput: (base, { theme }) => ({
      ...base,
      borderTop: 0,
      borderLeft: 0,
      borderRight: 0,
      border: "solid",
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.neutral0,
    }),
  }}
/>
```

Note that when using the callback function, the `styles` prop has access to `theme`
customizations as well.

### The `theme` prop

The default styles are derived from a theme object, which can be customized using
the `theme` prop.

```tsx
<CustomizeProvider
  theme={{
    borderRadius: 0,
    colors: {
      primary: "hsl(200, 100%, 60%)",
      primary75: "hsl(200, 100%, 55%)",
      primary50: "hsl(200, 100%, 40%)",
      primary25: "hsl(200, 100%, 35%)",

      danger: "#DE350B",
      dangerLight: "#FFBDAD",

      neutral0: "hsl(200, 50%, 97%)",
      neutral5: "hsl(200, 50%, 95%)",
      neutral10: "hsl(200, 50%, 90%)",
      neutral20: "hsl(200, 50%, 80%)",
      neutral30: "hsl(200, 50%, 70%)",
      neutral40: "hsl(200, 50%, 60%)",
      neutral50: "hsl(200, 50%, 50%)",
      neutral60: "hsl(200, 50%, 40%)",
      neutral70: "hsl(200, 50%, 30%)",
      neutral80: "hsl(200, 50%, 20%)",
      neutral90: "hsl(200, 50%, 10%)",
    },
    spacing: {
      baseUnit: 4,
      controlHeight: 10,
      menuGutter: 6,
    },
  }}
/>
```

### The `unstyled` prop

While it is always possible to override default styling, you may prefer to start
from completely unstyled components. Add the `unstyled` prop to remove all styling.

```tsx
<CustomizeProvider unstyled={true} />
```

## Inner components

The following list shows all of the customizable inner components used in a
`ComponentForm`.

```typescript
export type CustomizableProps = {
  componentForm: ComponentProps<typeof ComponentForm>;
  connectButton: ComponentProps<typeof ControlApp> &
    FormFieldContext<ConfigurableProp>;
  controlAny: ComponentProps<typeof ControlAny> &
    FormFieldContext<ConfigurableProp>;
  controlApp: ComponentProps<typeof ControlApp> &
    FormFieldContext<ConfigurableProp>;
  controlBoolean: ComponentProps<typeof ControlBoolean> &
    FormFieldContext<ConfigurableProp>;
  controlInput: ComponentProps<typeof ControlInput> &
    FormFieldContext<ConfigurableProp>;
  controlSubmit: ComponentProps<typeof ControlSubmit>;
  description: ComponentProps<typeof Description>;
  error: ComponentProps<typeof Errors>;
  errors: ComponentProps<typeof Errors>;
  field: ComponentProps<typeof Field>;
  heading: ComponentProps<typeof ComponentForm>;
  label: ComponentProps<typeof Label>;
  optionalFields: ComponentProps<typeof ComponentForm>;
  optionalFieldButton: ComponentProps<typeof OptionalFieldButton>;
};
```

Internally, `@pipedream/connect-react` uses `react-select` to implement complex
dropdown components.

```typescript
export type ReactSelectComponents = {
  controlAppSelect: typeof ControlApp;
  controlSelect: typeof ControlSelect;
};
```

Customizing dropdown components is very similar to customizing other inner components
except each dropdown supports deeper customization of elements within `react-select`

```tsx
<CustomizeProvider
  styles={{
    controlSelect: {
      control: (base, { theme }) => ({
        ...base,
        borderRadius: 0,
        borderColor: theme.colors.primary25,
        fontSize: "small",
        maxHeight: "36px",
      }),
    },
  }}
/>
```

See [React Select](https://react-select.com/) for more details on the
customization options available.

## Hooks

- `useCustomize` — _see above_
- `useFormContext`
- `useFormFieldContext`
- `useFrontendClient` — _allows use of provided Pipedream frontendClient_
- `useAccounts` — _react-query wrapper to list Pipedream connect accounts (for app, external user, etc.)_
- `useApp` — _react-query wrapper to retrieve a Pipedream app_
- `useApps` — _react-query wrapper to list Pipedream apps with support for sorting and filtering_
- `useComponent` — _react-query wrapper to retrieve a Pipedream component (action or trigger)_
- `useComponents` — _react-query wrapper to list Pipedream components (actions or triggers)_

See [hooks](./src/hooks) folder for details.
