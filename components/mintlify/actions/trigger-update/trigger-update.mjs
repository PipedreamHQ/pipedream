import mintlify from "../../mintlify.app.mjs";

export default {
  key: "mintlify-trigger-update",
  name: "Trigger Update",
  description: "Trigger an update for a project. [See the documentation](https://www.mintlify.com/docs/api-reference/update/trigger)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    mintlify,
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project to trigger an update on. Can be retrieved from your dashboard.",
    },
  },
  async run({ $ }) {
    const response = await this.mintlify.triggerUpdate({
      projectId: this.projectId,
      $,
    });

    $.export("$summary", `Successfully triggered an update for project ${this.projectId}`);

    return response;
  },
};
