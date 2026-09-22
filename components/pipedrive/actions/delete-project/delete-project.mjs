import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-delete-project",
  name: "Delete Project",
  description: "Permanently deletes a project. This is irreversible. Run **List Projects** first to obtain a valid project ID. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Projects#deleteProject)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    pipedriveApp,
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project to delete. Run **List Projects** first to obtain a valid project ID.",
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.deleteProject({
      $,
      projectId: this.projectId,
    });
    $.export("$summary", `Successfully deleted project ${this.projectId}`);
    return response;
  },
};
