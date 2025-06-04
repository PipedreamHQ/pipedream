import {
  useState, type CSSProperties,
} from "react";
import Markdown from "react-markdown";
import {
  ConfigurableProp, ConfigurableProps,
} from "@pipedream/sdk";
import { useCustomize } from "../hooks/customization-context";
import { FormFieldContext } from "../hooks/form-field-context";
import { FormContext } from "../hooks/form-context";

export type DescriptionProps<T extends ConfigurableProps, U extends ConfigurableProp> = {
  markdown?: string;
  field: FormFieldContext<U>;
  form: FormContext<T>;
};

// XXX should we rename to FieldDescription (so shared prefix + clear we need field context
// eg. cannot be used in OptionalFieldButton, or they need to be set up better)
export function Description<T extends ConfigurableProps, U extends ConfigurableProp>(props: DescriptionProps<T, U>) {
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
  return <div className={getClassNames("description", props)} style={getStyles("description", baseStyles, props)}> <Markdown components={{
    a: ({ ...linkProps }) => {
      const [
        isHovered,
        setIsHovered,
      ] = useState(false);

      const linkStyles: CSSProperties = {
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        color: "inherit",
        transition: "opacity 0.2s ease",
        opacity: isHovered
          ? 0.7
          : 1,
      };

      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "2px",
        }}>
          <a
            {...linkProps}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyles}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
          <span style={{
            fontSize: "0.7em",
            opacity: 0.7,
          }}>↗</span>
        </span>
      );
    },
  }}>
    {markdown}
  </Markdown></div>;
}
