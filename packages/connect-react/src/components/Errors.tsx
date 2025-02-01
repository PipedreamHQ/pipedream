import { FormContext } from "../hooks/form-context";
import type { FormFieldContext } from "../hooks/form-field-context";
import {
  ConfigurableProp, ConfigurablePropAlert, ConfigurableProps,
} from "@pipedream/sdk";
import { Alert } from "./Alert";

export type ErrorsProps<T extends ConfigurableProps, U extends ConfigurableProp> = {
  field: FormFieldContext<U>;
  form: FormContext<T>;
};

export function Errors<T extends ConfigurableProps, U extends ConfigurableProp>(props: ErrorsProps<T, U>) {
  const { field } = props;
  const {
    errors, prop,
  } = field

  if (!Object.keys(errors || {}).length) {
    return null;
  }

  if (!errors[prop.name]) {
    return null
  }

  // TODO depending on type does different shit... we might need async loader around the label, etc.?
  // maybe that should just be handled by FormFieldContext instead of container?

  const formattedErrors: ConfigurablePropAlert[] = []
  // for (const key in fieldErrors) {
  const key = "xxx"
  if (key === "sdkErrors") {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    formattedErrors.push(...errors[key].map((e) => {
      const o = JSON.parse(e)
      return {
        type: "alert",
        alertType: "error",
        content: `#${o.name}\n${o.message}`,
      }
    }))
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    formattedErrors.push(...errors[prop.name].map((e) => {
      return {
        type: "alert",
        alertType: "error",
        content: e,
      }
    }))
  }
  // }

  return (
    // <ul {...getProps("errors", baseStyles, props)}>
    //   {errors.map((msg) => <li key={msg} {...getProps("error", baseStyles, props)}>{msg}</li>)}
    // </ul>
    <>{formattedErrors.map((fe, idx: number) => <Alert prop={fe} key={idx}/>)}</>
  );
}
