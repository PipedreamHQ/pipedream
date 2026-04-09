import { ConfigurationError } from "@pipedream/platform";
import papertrail from "../../papertrail.app.mjs";

export default {
  key: "papertrail-register-system",
  name: "Register System",
  description: "Create a new log sender. [See the documentation](https://www.papertrail.com/help/settings-api/#register-system)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    papertrail,
    name: {
      type: "string",
      label: "Name",
      description: "Display name of the system in Papertrail",
    },
    hostname: {
      type: "string",
      label: "Hostname",
      description:
        "Syslog hostname filter (required when using a log destination). Events from other hostnames may be dropped when set.",
      optional: true,
    },
    ipAddress: {
      type: "string",
      label: "IP Address",
      description:
        "Source IP for standard syslog (port 514). Use this flow when not using a custom destination.",
      optional: true,
    },
    destinationId: {
      type: "string",
      label: "Destination ID",
      description: "Log destination ID from your Papertrail account",
      optional: true,
    },
    destinationPort: {
      type: "string",
      label: "Destination Port",
      description: "Destination port number (alternative to Destination ID)",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional freeform description",
      optional: true,
    },
    autoDelete: {
      type: "boolean",
      label: "Auto Delete",
      description:
        "Whether Papertrail may automatically remove the system when idle (default follows destination or API default)",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.destinationId || this.destinationPort) {
      if (!this.hostname) {
        throw new ConfigurationError(
          "For a log-destination system, `Hostname` is required (filter hostname for syslog).",
        );
      }
    } else if (!this.ipAddress) {
      throw new ConfigurationError(
        "Provide either `Destination ID` or `Destination Port` with `Hostname`, or `IP Address` for standard syslog (port 514).",
      );
    }

    const formParams = {
      "system[name]": this.name,
    };
    if (this.hostname) formParams["system[hostname]"] = this.hostname;
    if (this.ipAddress) formParams["system[ip_address]"] = this.ipAddress;
    if (this.description) formParams["system[description]"] = this.description;
    if (this.autoDelete !== undefined) {
      formParams["system[auto_delete]"] = this.autoDelete
        ? "true"
        : "false";
    }
    if (this.destinationId) formParams.destination_id = this.destinationId;
    if (this.destinationPort) formParams.destination_port = this.destinationPort;

    const response = await this.papertrail.registerSystem({
      $,
      formParams,
    });
    $.export(
      "$summary",
      `Registered system **${response.name}** (id ${response.id})`,
    );
    return response;
  },
};
