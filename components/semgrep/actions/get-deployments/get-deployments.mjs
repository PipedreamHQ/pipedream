import semgrep from "../../semgrep.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "semgrep-get-deployments",
  name: "Get Deployments",
  description: "Returns a list of deployments. [See the documentation](https://semgrep.dev/api/v1/docs/#tag/deployment/operation/semgrep_app.saas.handlers.deployment.openapi_list_deployments)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    semgrep,
  },
  async run({ $ }) {
    const response = await this.semgrep.listDeployments();
    $.export("$summary", "Successfully retrieved deployments");
    return response;
  },
};
