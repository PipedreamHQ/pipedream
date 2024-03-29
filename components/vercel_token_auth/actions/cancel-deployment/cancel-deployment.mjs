import vercelTokenAuth from "../../vercel_token_auth.app.mjs";

export default {
  key: "vercel_token_auth-cancel-deployment",
  name: "Cancel Deployment",
  description: "Cancel a deployment which is currently building. [See the docs](https://vercel.com/docs/rest-api#endpoints/deployments/cancel-a-deployment)",
  version: "0.0.3",
  type: "action",
  props: {
    vercelTokenAuth,
    deployment: {
      propDefinition: [
        vercelTokenAuth,
        "deployment",
        () => ({
          state: "BUILDING",
        }),
      ],
    },
    team: {
      propDefinition: [
        vercelTokenAuth,
        "team",
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
