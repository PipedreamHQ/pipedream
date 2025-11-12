import deepgram from "../../deepgram.app.mjs";

export default {
  key: "deepgram-get-project",
  name: "Get Project",
  description: "Retrieves basic information about the specified project. [See the documentation](https://developers.deepgram.com/api-reference/projects/#get-projects)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    deepgram,
    projectId: {
      propDefinition: [
        deepgram,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const project = await this.deepgram.getProject({
      projectId: this.projectId,
      $,
    });

    if (project) {
      $.export("$summary", `Successfully retrieved project with ID ${this.projectId}`);
    }

    return project;
  },
};
