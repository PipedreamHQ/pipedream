import semgrep from "../../semgrep.app.mjs";

export default {
  key: "semgrep-get-deployments",
  name: "Get Deployments",
  description: "Returns a list of deployments. [See the documentation](https://semgrep.dev/api/v1/docs/#tag/deployment/operation/semgrep_app.saas.handlers.deployment.openapi_list_deployments)",
  version: "0.0.1",
  type: "action",
  props: {
    semgrep,
  },
  async run({ $ }) {
    const response = await this.semgrep.listDeployments({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.deployments.length} deployments`);

    return response;
  },
};
