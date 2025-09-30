import nethuntCrm from "../../nethunt_crm.app.mjs";

export default {
  key: "nethunt_crm-create-comment",
  name: "Create Comment",
  description: "Create a new record comment. [See docs here](https://nethunt.com/integration-api#create-comment)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nethuntCrm,
    folderId: {
      propDefinition: [
        nethuntCrm,
        "folderId",
      ],
    },
    recordId: {
      propDefinition: [
        nethuntCrm,
        "recordId",
        (c) => ({
          folderId: c.folderId,
        }),
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text of the comment",
    },
  },
  async run({ $ }) {
    const response = await this.nethuntCrm.createComment({
      recordId: this.recordId,
      data: {
        text: this.text,
      },
    });
    $.export("$summary", "New comment created successfully");
    return response;
  },
};
