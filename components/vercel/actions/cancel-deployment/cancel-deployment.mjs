import vercel from "../../vercel.app.mjs";

export default {
  key: "vercel-cancel-deployment",
  name: "Cancel Deployment",
  description: "Cancel a deployment which is currently building. [See the docs](https://vercel.com/docs/rest-api#endpoints/deployments/cancel-a-deployment)",
  version: "0.0.3",
  type: "action",
  props: {
    vercel,
    deployment: {
      propDefinition: [
        vercel,
        "deployment",
        () => ({
          state: "BUILDING",
        }),
      ],
    },
    team: {
      propDefinition: [
        vercel,
        "team",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      teamId: this.team,
    };
    const res = await this.vercel.cancelDeployment(this.deployment, params, $);
    $.export("$summary", `Successfully canceled deployment ${this.deployment}`);
    return res;
  },
};
