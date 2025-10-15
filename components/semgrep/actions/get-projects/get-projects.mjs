import semgrep from "../../semgrep.app.mjs";

export default {
  key: "semgrep-get-projects",
  name: "Get Projects",
  description: "Returns a list of projects for a given deployment slug. [See the documentation](https://semgrep.dev/api/v1/docs/#tag/project/operation/semgrep_app.saas.handlers.repository.openapi_list_recent_projects)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.semgrep.listProjects({
      $,
      deploymentSlug: this.deploymentSlug,
    });

    $.export("$summary", `Retrieved ${response.projects.length} projects for deployment slug \`${this.deploymentSlug}\``);

    return response;
  },
};
