import { ConfigurationError } from "@pipedream/platform";

export const validateRegisterSystemProps = (props) => {
  const {
    name,
    hostname,
    ipAddress,
    destinationId,
    destinationPort,
  } = props;
  if (!name?.trim()) {
    throw new ConfigurationError("`Name` is required to register a system.");
  }
  const hasDestination = destinationId != null && String(destinationId).trim() !== ""
    || destinationPort != null && String(destinationPort).trim() !== "";
  if (hasDestination) {
    if (!hostname?.trim()) {
      throw new ConfigurationError(
        "For a log-destination system, `Hostname` is required (filter hostname for syslog).",
      );
    }
    return;
  }
  if (!ipAddress?.trim()) {
    throw new ConfigurationError(
      "Provide either `Destination ID` or `Destination Port` with `Hostname`, or `IP Address` for standard syslog (port 514).",
    );
  }
};
