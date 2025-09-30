import meistertask from "../../meistertask.app.mjs";

export default {
  key: "meistertask-get-label",
  name: "Get Label",
  description: "Retrieves information about a label. [See the docs](https://developers.meistertask.com/reference/get-label)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    meistertask,
    projectId: {
      propDefinition: [
        meistertask,
        "projectId",
      ],
    },
    sectionId: {
      propDefinition: [
        meistertask,
        "sectionId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
    taskId: {
      propDefinition: [
        meistertask,
        "taskId",
        (c) => ({
          projectId: c.projectId,
          sectionId: c.sectionId,
        }),
      ],
      optional: true,
    },
    labelId: {
      propDefinition: [
        meistertask,
        "labelId",
        (c) => ({
          projectId: c.projectId,
          taskId: c.taskId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.meistertask.getLabel({
      labelId: this.labelId,
      $,
    });
    if (response) {
      $.export("$summary", `Successfully retrieved label with ID ${this.labelId}`);
    }
    return response;
  },
};
