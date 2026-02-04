import daytona from "../../daytona.app.mjs";

export default {
  key: "daytona-get-sandbox",
  name: "Get Sandbox",
  description: "Get a sandbox on Daytona. [See the documentation](https://www.daytona.io/docs/en/typescript-sdk/daytona/#get)",
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
  },
  async run({ $ }) {
    const response = await this.daytona.getSandbox(this.sandboxId);
    $.export("$summary", `Successfully retrieved sandbox ${this.sandboxId}`);
    return response;
  },
};
