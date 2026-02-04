import daytona from "../../daytona.app.mjs";

export default {
  key: "daytona-revoke-ssh-access",
  name: "Revoke SSH Access",
  description: "Revoke SSH access for a sandbox on Daytona. [See the documentation](https://www.daytona.io/docs/en/typescript-sdk/sandbox/#revokesshaccess)",
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
    token: {
      type: "string",
      label: "Token",
      description: "The token to revoke",
      secret: true,
    },
  },
  async run({ $ }) {
    const response = await this.daytona.revokeSshAccess(this.sandboxId, this.token);
    $.export("$summary", `Successfully revoked SSH access for sandbox ${this.sandboxId}`);
    return response;
  },
};
