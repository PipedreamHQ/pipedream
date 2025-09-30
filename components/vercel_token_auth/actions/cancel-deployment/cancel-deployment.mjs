import vercelTokenAuth from "../../vercel_token_auth.app.mjs";

export default {
  key: "vercel_token_auth-cancel-deployment",
  name: "Cancel Deployment",
  description: "Cancel a deployment which is currently building. [See the documentation](https://vercel.com/docs/rest-api/endpoints/deployments#cancel-a-deployment)",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    vercelTokenAuth,
    team: {
      propDefinition: [
        vercelTokenAuth,
        "team",
      ],
    },
    deployment: {
      propDefinition: [
        vercelTokenAuth,
        "deployment",
        (c) => ({
          teamId: c.team,
          state: "BUILDING",
        }),
      ],
    },
  },
  async run({ $ }) {
    const params = {
      teamId: this.team,
    };
    const res = await this.vercelTokenAuth.cancelDeployment(this.deployment, params, $);
    $.export("$summary", `Successfully canceled deployment ${this.deployment}`);
    return res;
  },
};
