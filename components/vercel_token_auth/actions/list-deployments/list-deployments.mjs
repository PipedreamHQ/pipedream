import vercelTokenAuth from "../../vercel_token_auth.app.mjs";

export default {
  key: "vercel_token_auth-list-deployments",
  name: "List Deployments",
  description: "List deployments under the account corresponding to the API token. [See the docs](https://vercel.com/docs/rest-api#endpoints/deployments/list-deployments)",
  version: "0.0.3",
  type: "action",
  props: {
    vercelTokenAuth,
    project: {
      propDefinition: [
        vercelTokenAuth,
        "project",
      ],
    },
    team: {
      propDefinition: [
        vercelTokenAuth,
        "team",
      ],
    },
    state: {
      propDefinition: [
        vercelTokenAuth,
        "state",
      ],
    },
    max: {
      propDefinition: [
        vercelTokenAuth,
        "max",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      projectId: this.project,
      state: this.state,
      teamId: this.team,
    };
    const res = await this.vercelTokenAuth.listDeployments(params, this.max, $);
    $.export("$summary", `Found ${res.length} deployment${res.length !== 1
      ? "s"
      : ""}`);
    return res;
  },
};
