import meistertask from "../../meistertask.app.mjs";

export default {
  key: "meistertask-get-attachment",
  name: "Get Attachment",
  description: "Retrieves information about an attachment. [See the docs](https://developers.meistertask.com/reference/get-attachment)",
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
      optional: true,
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
    },
    attachmentId: {
      propDefinition: [
        meistertask,
        "attachmentId",
        (c) => ({
          taskId: c.taskId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.meistertask.getAttachment({
      $,
      attachmentId: this.attachmentId,
    });
    if (response) {
      $.export("$summary", `Successfully retrieved attachment with ID ${this.attachmentId}`);
    }
    return response;
  },
};
