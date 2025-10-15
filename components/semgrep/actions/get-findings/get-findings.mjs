import semgrep from "../../semgrep.app.mjs";

export default {
  key: "semgrep-get-findings",
  name: "Get Findings",
  description: "Returns a list of findings for a specified deployment. [See the documentation](https://semgrep.dev/api/v1/docs/#tag/finding/operation/semgrep_app.core_exp.findings.handlers.issue.openapi_list_recent_issues)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    semgrep,
    deploymentSlug: {
      propDefinition: [
        semgrep,
        "deploymentSlug",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.semgrep.listFindings({
      $,
      deploymentSlug: this.deploymentSlug,
    });

    $.export("$summary", `Retrieved ${response.findings.length} findings for deployment \`${this.deploymentSlug}\``);

    return response;
  },
};
