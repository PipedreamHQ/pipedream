import sendx from "../../sendx.app.mjs";

export default {
  key: "sendx-add-tag-contact",
  name: "Add Tag to Contact",
  description: "Associates a user-provided tag with a specified contact in SendX. This action requires the contact's identification detail and the tag.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
        addTags: [
          this.tag,
        ],
      },
    });

    $.export("$summary", `Successfully associated tag '${this.tag}' with contact '${this.contactEmail}'`);
    return response;
  },
};
