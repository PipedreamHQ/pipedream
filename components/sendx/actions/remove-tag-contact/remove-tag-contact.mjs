import sendx from "../../sendx.app.mjs";

export default {
  key: "sendx-remove-tag-contact",
  name: "Remove Tag from Contact",
  description: "De-associates a user-provided tag from a given contact in SendX.",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendx,
    contactEmail: {
      propDefinition: [
        sendx,
        "contactEmail",
      ],
    },
    tag: {
      propDefinition: [
        sendx,
        "tag",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sendx.updateTag({
      $,
      params: {
        email: this.contactEmail,
      },
      data: {
        removeTags: [
          this.tag,
        ],
      },
    });

    $.export("$summary", `Successfully associated tag '${this.tag}' with contact '${this.contactEmail}'`);
    return response;
  },
};
