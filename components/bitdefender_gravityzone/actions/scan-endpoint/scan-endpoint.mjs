import bitdefender from "../../bitdefender_gravityzone.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "bitdefender_gravityzone-scan-endpoint",
  name: "Scan Endpoint",
  description: "Trigger a scan on a specific endpoint. [See the documentation](https://www.bitdefender.com/business/support/en/77209-128495-createscantask.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bitdefender,
    endpointId: {
      propDefinition: [
        bitdefender,
        "endpointId",
      ],
    },
    scanType: {
      type: "integer",
      label: "Scan Type",
      description: "Type of scan to perform",
      options: [
        {
          label: "Quick Scan",
          value: 1,
        },
        {
          label: "Full Scan",
          value: 2,
        },
        {
          label: "Memory Scan",
          value: 3,
        },
        {
          label: "Custom Scan",
          value: 4,
        },
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the task. If the parameter is not passed, the name will be automatically generated.",
      optional: true,
    },
    returnAllTaskIds: {
      type: "boolean",
      label: "Return All Task IDs",
      description: "Indicates if the response will contain the IDs for all the tasks created as a result of the request",
      optional: true,
    },
    scanDepth: {
      type: "integer",
      label: "Scan Depth",
      description: "The scan profile",
      options: [
        {
          label: "Aggressive",
          value: 1,
        },
        {
          label: "Normal",
          value: 2,
        },
        {
          label: "Permissivearray",
          value: 3,
        },
      ],
      optional: true,
    },
    scanPath: {
      type: "string[]",
      label: "Scan Path",
      description: "The list of target paths to be scanned",
      optional: true,
    },
  },
  async run({ $ }) {
    if ((this.scanDepth || this.scanPath) && this.scanType !== 4) {
      throw new ConfigurationError("Scan depth and path can only be used for custom scans");
    }

    if ((this.scanDepth && !this.scanPath) || (this.scanPath && !this.scanDepth)) {
      throw new ConfigurationError("Scan depth and path must be used together");
    }

    const response = await this.bitdefender.scanEndpoint({
      $,
      data: {
        params: {
          targetIds: [
            this.endpointId,
          ],
          type: this.scanType,
          name: this.name,
          returnAllTaskIds: this.returnAllTaskIds,
          customScanSettings: this.scanDepth
            ? {
              scanDepth: this.scanDepth,
              scanPath: this.scanPath,
            }
            : undefined,
        },
      },
    });

    $.export("$summary", `Successfully initiated ${this.scanType} scan on endpoint ${this.endpointId}`);
    return response;
  },
};
