import type { CSSProperties } from "react";
import Markdown from "react-markdown";
import { ConfigurableProp } from "@pipedream/sdk";
import { useCustomize } from "../hooks/customization-context";
import { FormFieldContext } from "../hooks/form-field-context";
import { FormContext } from "../hooks/form-context";

export type DescriptionProps<T extends ConfigurableProp> = {
  markdown?: string;
  field: FormFieldContext<T>;
  form: FormContext;
};

// XXX should we rename to FieldDescription (so shared prefix + clear we need field context
// eg. cannot be used in OptionalFieldButton, or they need to be set up better)
export function Description<T extends ConfigurableProp>(props: DescriptionProps<T>) {
  if (!props.field) {
    console.log("props", props);
  }
  const {
    field, markdown,
  } = props;
  const { prop } = field;
  const {
    getClassNames, getStyles, theme,
  } = useCustomize();

  const baseStyles: CSSProperties = {
    color: theme.colors.neutral50,
    fontWeight: 400,
    fontSize: "0.75rem",
    gridArea: "description",
    textWrap: "balance",
    lineHeight: "1.5",
  };

  if (prop.type === "app") {
    // TODO
    return <p className={getClassNames("description", props)} style={getStyles("description", baseStyles, props)}>Credentials are encrypted.</p>;
  }
  if (!prop.description) {
    return null;
  }
  return <div className={getClassNames("description", props)} style={getStyles("description", baseStyles, props)}><Markdown>{markdown}</Markdown></div>;
}
