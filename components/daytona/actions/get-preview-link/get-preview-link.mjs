import daytona from "../../daytona.app.mjs";

export default {
  key: "daytona-get-preview-link",
  name: "Get Preview Link",
  description: "Get a preview URL for a service running on a specific port in a Daytona sandbox. Useful for accessing web servers, APIs, or other HTTP services running inside the sandbox. [See the documentation](https://www.daytona.io/docs/en/typescript-sdk/sandbox/#getpreviewlink)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    daytona,
    sandboxId: {
      propDefinition: [
        daytona,
        "sandboxId",
      ],
    },
    port: {
      type: "integer",
      label: "Port",
      description: "The port number of the service running in the sandbox (e.g. `3000`, `8080`)",
      min: 1,
      max: 65535,
    },
  },
  async run({ $ }) {
    const response = await this.daytona.getPreviewLink(this.sandboxId, this.port);
    $.export("$summary", `Successfully retrieved preview link for port ${this.port} on sandbox ${this.sandboxId}`);
    return response;
  },
};
