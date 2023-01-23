import vercel from "../../vercel.app.mjs";

export default {
  key: "vercel-list-deployments",
  name: "List Deployments",
  description: "List deployments under the account corresponding to the API token. [See the docs](https://vercel.com/docs/rest-api#endpoints/deployments/list-deployments)",
  version: "0.0.3",
  type: "action",
  props: {
    vercel,
    project: {
      propDefinition: [
        vercel,
        "project",
      ],
    },
    team: {
      propDefinition: [
        vercel,
        "team",
      ],
    },
    state: {
      propDefinition: [
        vercel,
        "state",
      ],
    },
    max: {
      propDefinition: [
        vercel,
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
    const res = await this.vercel.listDeployments(params, this.max, $);
    $.export("$summary", `Found ${res.length} deployment${res.length !== 1
      ? "s"
      : ""}`);
    return res;
  },
};
