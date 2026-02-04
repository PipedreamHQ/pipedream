import daytona from "../../daytona.app.mjs";

export default {
  key: "daytona-create-ssh-access",
  name: "Create SSH Access",
  description: "Create SSH access for a sandbox on Daytona. [See the documentation](https://www.daytona.io/docs/en/typescript-sdk/sandbox/#createsshaccess)",
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
    expiresInMinutes: {
      type: "integer",
      label: "Expires In Minutes",
      description: "The number of minutes the SSH access token will be valid for",
      default: 60,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.daytona.createSshAccess(this.sandboxId, this.expiresInMinutes);
    $.export("$summary", `Successfully created SSH access for sandbox ${this.sandboxId}`);
    return response;
  },
};
