import type {
  ConfigurableProp, ConfigurablePropApp,
} from "@pipedream/sdk";
import { FormFieldContext } from "../hooks/form-field-context";
import { useFormContext } from "../hooks/form-context";
import { Field } from "./Field";
import { useApp } from "../hooks/use-app";
import {
  useEffect, useCallback,
} from "react";
import { isConfigurablePropOfType } from "../utils/type-guards";

type FieldInternalProps<T extends ConfigurableProp> = {
  prop: T;
  idx: number;
};

export function InternalField<T extends ConfigurableProp>({
  prop, idx,
}: FieldInternalProps<T>) {
  const formCtx = useFormContext();
  const {
    id: formId, configuredProps, registerField, setConfiguredProp, errors, enableDebugging,
  } = formCtx;

  let appSlug: ConfigurablePropApp["app"] | undefined;
  if (isConfigurablePropOfType(prop, "app")) {
    appSlug = prop.app;
  }
  const {
    // TODO error
    app,
  } = useApp(appSlug || "", {
    useQueryOpts: {
      enabled: !!appSlug,
      suspense: !!appSlug,
    },
  });

  const fieldId = `pd${formId}${prop.name}`; // id is of form `:r{d}:` so has seps

  // Memoize the onChange callback to prevent recreating it on every render
  const handleChange = useCallback((value: unknown) => {
    setConfiguredProp(idx, value);
  }, [
    idx,
    prop.name,
    setConfiguredProp,
  ]);

  // Create fieldCtx with current value on each render
  const fieldCtx: FormFieldContext<T> = {
    id: fieldId,
    prop,
    idx,
    value: configuredProps[prop.name],
    onChange: handleChange,
    extra: {
      app,
    },
    errors,
    enableDebugging,
  };

  // Only register field on initial mount (when prop.name changes)
  // Don't re-register on every value change - that causes infinite loops
  useEffect(() => {
    registerField(fieldCtx);
  }, [
    prop.name,
    registerField,
  ]); // Only re-run if field name changes

  return (
    <FormFieldContext.Provider value={fieldCtx}>
      <Field field={fieldCtx} form={formCtx} />
    </FormFieldContext.Provider>
  );
}
