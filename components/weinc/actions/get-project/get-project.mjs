import weinc from "../../weinc.app.mjs";

export default {
  key: "weinc-get-project",
  name: "Get Project",
  description: "Retrieves the details of a project. [See the documentation](https://my.we.inc/api/v1/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    weinc,
    projectId: {
      propDefinition: [
        weinc,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.weinc.getProject({
      $,
      projectId: this.projectId,
    });
    $.export("$summary", `Successfully retrieved project ${this.projectId}`);
    return response;
  },
};
