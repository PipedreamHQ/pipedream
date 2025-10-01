import nethuntCrm from "../../nethunt_crm.app.mjs";

export default {
  key: "nethunt_crm-add-gmail-thread-to-record",
  name: "Add Gmail Thread to Record",
  description: "Links a Gmail thread to a record. [See docs here](https://nethunt.com/integration-api#link-gmail-thread)",
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
    gmailThreadId: {
      type: "string",
      label: "Gmail Thread ID",
      description: "The Gmail Thread ID.",
    },
  },
  async run({ $ }) {
    const response = await this.nethuntCrm.linkGmailThread({
      recordId: this.recordId,
      data: {
        gmailThreadId: this.gmailThreadId,
      },
    });
    $.export("$summary", "Linked Gmail thread successfully");
    return response;
  },
};
