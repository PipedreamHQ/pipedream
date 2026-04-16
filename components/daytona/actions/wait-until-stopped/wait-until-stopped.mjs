import daytona from "../../daytona.app.mjs";

export default {
  key: "daytona-wait-until-stopped",
  name: "Wait Until Stopped",
  description: "Wait for Sandbox to reach 'stopped' state. [See the documentation](https://www.daytona.io/docs/en/typescript-sdk/sandbox/#waituntilstopped)",
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
    const response = await this.daytona.waitUntilStopped(this.sandboxId, this.timeout);
    $.export("$summary", `Successfully waited until sandbox ${this.sandboxId} is stopped`);
    return response;
  },
};
