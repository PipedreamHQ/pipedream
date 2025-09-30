import semgrep from "../../semgrep.app.mjs";

export default {
  key: "semgrep-update-project",
  name: "Update Project",
  description: "Update a project on Semgrep. [See the documentation](https://semgrep.dev/api/v1/docs/#tag/project/operation/semgrep_app.saas.handlers.repository.openapi_patch_project)",
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
    projectName: {
      propDefinition: [
        semgrep,
        "projectName",
        (c) => ({
          deploymentSlug: c.deploymentSlug,
        }),
      ],
    },
    tags: {
      propDefinition: [
        semgrep,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const tags = typeof this.tags === "string"
      ? JSON.parse(this.tags)
      : this.tags;

    const response = await this.semgrep.updateProject({
      deploymentSlug: this.deploymentSlug,
      projectName: this.projectName,
      data: {
        tags,
      },
    });

    $.export("$summary", `Successfully updated the project '${this.projectName}'`);

    return response;
  },
};
