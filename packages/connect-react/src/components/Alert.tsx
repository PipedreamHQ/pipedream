import type { ConfigurablePropAlert } from "@pipedream/sdk";
import Markdown from "react-markdown";

type AlertProps = {
  prop: ConfigurablePropAlert;
};

export function Alert({ prop }: AlertProps) {
  const baseStyles = {
    width: "100%",
    background: "#e2e3e5",
    borderRadius: "5px",
    paddingTop: "2px",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingBottom: "2px",
  }

  const warningStyles = {
    ...baseStyles,
    background: "#fff3cd",
  };

  const infoStyles = {
    ...baseStyles,
    background: "#d1ecf1",
  }

  const errorStyles = {
    ...baseStyles,
    background: "#f8d7da",
  }

  const neutralStyles = {
    ...baseStyles,
    background: "#fffff2",
  }

  let alertStyles = {}
  switch (prop.alertType) {
  case "info":
    alertStyles = infoStyles
    break
  case "neutral":
    alertStyles = neutralStyles
    break
  case "warning":
    alertStyles = warningStyles
    break
  case "error":
    alertStyles = errorStyles
    break
  default:
    alertStyles = baseStyles
  }

  return (<div className={`pd-alert-${prop.alertType}`} style={alertStyles}>
    <Markdown components={{
      a: ({ ...props }) => {
        return <a {...props} target="_blank" rel="noopener noreferrer" />;
      },
    }}>
      {prop.content}
    </Markdown>
  </div>)
}
