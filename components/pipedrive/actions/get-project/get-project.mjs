import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-get-project",
  name: "Get Project",
  description: "Gets a single project by its ID. Run **List Projects** first to obtain a valid project ID. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Projects#getProject)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pipedriveApp,
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project to retrieve. Run **List Projects** first to obtain a valid project ID.",
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.getProject({
      $,
      projectId: this.projectId,
    });
    $.export("$summary", `Successfully retrieved project ${this.projectId}`);
    return response;
  },
};
