import daytona from "../../daytona.app.mjs";

export default {
  key: "daytona-stop-sandbox",
  name: "Stop Sandbox",
  description: "Stop a sandbox on Daytona. [See the documentation](https://www.daytona.io/docs/en/typescript-sdk/sandbox/#stop)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    daytona,
    sandboxId: {
      propDefinition: [
        daytona,
        "sandboxId",
      ],
    },
    timeout: {
      propDefinition: [
        daytona,
        "timeout",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.daytona.stopSandbox(this.sandboxId, this.timeout);
    $.export("$summary", `Successfully stopped sandbox ${this.sandboxId}`);
    return response;
  },
};
