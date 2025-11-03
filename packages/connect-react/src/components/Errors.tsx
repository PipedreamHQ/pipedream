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
    enableDebugging,
    errors = {},
    prop = {} as ConfigurableProp,
  } = field

  if (!enableDebugging) {
    return null
  }

  if (!errors[prop.name]) {
    return null
  }

  // TODO depending on type does different shit... we might need async loader around the label, etc.?
  // maybe that should just be handled by FormFieldContext instead of container?

  const formattedErrors: ConfigurablePropAlert[] = errors[prop.name].map((e) => {
    return {
      type: "alert",
      alertType: "error",
      content: e,
      name: prop.name,
    }
  })

  const baseStyles = {
    display: "grid",
    gridTemplateColumns: "max-content",
  }

  const FormattedErrors = () => {
    return <>{formattedErrors.map((fe, idx: number) => <Alert prop={fe} key={idx}/>)}</>
  }

  return (
    <div className="pd-errors" style={baseStyles}><FormattedErrors/></div>
  );
}
