import type { ConfigurableProp } from "@pipedream/sdk";
import { FormFieldContext } from "../hooks/form-field-context";
import { useFormContext } from "../hooks/form-context";
import { Field } from "./Field";
import { useApp } from "../hooks/use-app";
import { useEffect } from "react";

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

  const appSlug = prop.type === "app" && "app" in prop
    ? prop.app
    : undefined;
  const {
    // TODO error
    app,
  } = useApp(appSlug || "", {
    useQueryOpts: {
      enabled: !!appSlug,

      // @ts-expect-error this seems to work (this overrides enabled so don't just set to true)
      suspense: !!appSlug,
    },
  });

  const fieldId = `pd${formId}${prop.name}`; // id is of form `:r{d}:` so has seps

  const fieldCtx: FormFieldContext<T> = {
    id: fieldId,
    prop,
    idx,
    value: configuredProps[prop.name],
    onChange(value) {
      setConfiguredProp(idx, value);
    },
    extra: {
      app,
    },
    errors,
    enableDebugging,
  };
  useEffect(() => registerField(fieldCtx), [
    fieldCtx,
  ])
  return (
    <FormFieldContext.Provider value={fieldCtx}>
      <Field field={fieldCtx} form={formCtx} />
    </FormFieldContext.Provider>
  );
}
