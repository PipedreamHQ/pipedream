import {
  Suspense, useEffect, useState,
} from "react";
import type {
  CSSProperties, FormEventHandler,
} from "react";
import { useCustomize } from "../hooks/customization-context";
import {
  useFormContext,
  skippablePropTypes,
} from "../hooks/form-context";
import { InternalField } from "./InternalField";
import { Alert } from "./Alert";
import { ErrorBoundary } from "./ErrorBoundary";
import { ControlSubmit } from "./ControlSubmit";
import type {
  ConfigurableProp, ConfigurablePropAlert,
} from "@pipedream/sdk";
import { isConfigurablePropOfType } from "../utils/type-guards";

const alwaysShowSdkErrors = [
  "ConfigurationError",
]

export function InternalComponentForm() {
  const formContext = useFormContext();
  const {
    configurableProps,
    dynamicPropsQueryIsFetching,
    isValid,
    optionalPropIsEnabled,
    optionalPropSetEnabled,
    props: formContextProps,
    setSubmitting,
    sdkErrors: __sdkErrors,
    submitting,
    enableDebugging,
  } = formContext;

  const showSdkErrors = enableDebugging || __sdkErrors.filter((e) => alwaysShowSdkErrors.includes(e.name)).length > 0

  const {
    hideOptionalProps, onSubmit,
  } = formContextProps;

  const [
    sdkErrors,
    setSdkErrors,
  ] = useState<ConfigurablePropAlert[]>([])

  useEffect(() => {
    if (submitting) setSdkErrors([])
    else {
      if (__sdkErrors && __sdkErrors.length) {
        setSdkErrors(__sdkErrors.map((e) => {
          return {
            type: "alert",
            alertType: "error",
            content: `# ${e.name}\n${e.message}`,
            name: e.name,
          } as ConfigurablePropAlert
        }))
      }
    }
  }, [
    __sdkErrors,
    submitting,
  ]);

  const {
    getComponents, getProps, theme,
  } = useCustomize();
  const { OptionalFieldButton } = getComponents();
  const baseStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  };

  const baseOptionalFieldsStyles: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.375rem",
  };

  const baseHeadingStyles: CSSProperties = {
    fontWeight: 600,
    textTransform: "capitalize",
    color: theme.colors.neutral60,
    fontSize: "0.875rem",
    lineHeight: "1.375",
    margin: "0 0 0.5rem 0",
  };

  const _onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    if (onSubmit) {
      e.preventDefault();

      if (isValid) {
        setSubmitting(true);
        try {
          await onSubmit(formContext);
        } finally {
          setSubmitting(false);
        }
      }
    }
  };

  const shownProps: [ConfigurableProp, number][] = [];
  const optionalProps: [ConfigurableProp, boolean][] = [];
  for (let idx = 0; idx < configurableProps.length; idx++) {
    const prop = configurableProps[idx];
    if (prop.hidden) {
      continue;
    }
    if (skippablePropTypes.includes(prop.type)) {
      continue;
    }
    if (prop.optional) {
      const enabled = optionalPropIsEnabled(prop);
      optionalProps.push([
        prop,
        enabled,
      ]);
      if (!enabled) {
        continue;
      }
    }
    shownProps.push([
      prop,
      idx,
    ]);
  }

  // TODO improve the error boundary thing (use default Alert component maybe)

  return (
    <ErrorBoundary fallback={(err) => <p style={{
      color: "red",
    }}>Error: {err && typeof err === "object" && "message" in err && typeof err.message === "string"
        ? err.message
        : "Unknown"}</p>}>
      <Suspense fallback={<p>Loading form...</p>}>
        <form {...getProps("componentForm", baseStyles, formContextProps)} onSubmit={_onSubmit}>
          {shownProps.map(([
            prop,
            idx,
          ]) => {
            if (isConfigurablePropOfType(prop, "alert")) {
              return <Alert key={prop.name} prop={prop} />;
            }
            return <InternalField key={prop.name} prop={prop} idx={idx} />;
          })}
          {dynamicPropsQueryIsFetching && <p>Loading dynamic props...</p>}
          {(!hideOptionalProps && optionalProps.length)
            ? <div>
              <div {...getProps("heading", baseHeadingStyles, formContextProps)}>Optional Props</div>
              <div {...getProps("optionalFields", baseOptionalFieldsStyles, formContextProps)}>
                {optionalProps.map(([
                  prop,
                  enabled,
                ]) => <OptionalFieldButton
                  key={prop.name}
                  prop={prop}
                  enabled={enabled}
                  onClick={() => optionalPropSetEnabled(prop, !enabled)}
                />)}
              </div>
            </div>
            : null}
          { showSdkErrors && sdkErrors?.map((e, idx) => <Alert prop={e} key={idx}/>)}
          {onSubmit && <ControlSubmit form={formContext} />}
        </form>
      </Suspense>
    </ErrorBoundary>
  );
}
