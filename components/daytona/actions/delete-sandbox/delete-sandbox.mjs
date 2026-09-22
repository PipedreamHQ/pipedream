import daytona from "../../daytona.app.mjs";

export default {
  key: "daytona-delete-sandbox",
  name: "Delete Sandbox",
  description: "Deletes a sandbox on Daytona. This action is irreversible and all data in the sandbox will be lost. [See the documentation](https://www.daytona.io/docs/en/typescript-sdk/sandbox/#delete)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
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
    await this.daytona.deleteSandbox(this.sandboxId, this.timeout);
    $.export("$summary", `Successfully deleted sandbox ${this.sandboxId}`);
  },
};
