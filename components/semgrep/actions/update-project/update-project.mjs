import semgrep from "../../semgrep.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "semgrep-update-project",
  name: "Update Project",
  description: "Update a project on Semgrep. [See the documentation](https://semgrep.dev/api/v1/docs/#tag/project/operation/semgrep_app.saas.handlers.repository.openapi_patch_project)",
  version: "0.0.{{ts}}",
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
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.semgrep.updateProject({
      deploymentSlug: this.deploymentSlug,
      projectName: this.projectName,
      tags: this.tags,
    });

    $.export("$summary", `Successfully updated the project '${this.projectName}'`);
    return response;
  },
};
