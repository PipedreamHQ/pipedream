import daytona from "../../daytona.app.mjs";

export default {
  key: "daytona-start-sandbox",
  name: "Start Sandbox",
  description: "Start a sandbox on Daytona. [See the documentation](https://www.daytona.io/docs/en/typescript-sdk/sandbox/#start)",
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
    const response = await this.daytona.startSandbox(this.sandboxId, this.timeout);
    $.export("$summary", `Successfully started sandbox ${this.sandboxId}`);
    return response;
  },
};
