import membado from "../../membado.app.mjs";

export default {
  name: "Add or Remove Tags from User",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "membado-add-remove-tags",
  description:
    "Assign tags to or remove them from a user. [See the documentation](https://membado.zendesk.com/hc/de/articles/18155937106204-API-Documentation)",
  type: "action",
  props: {
    membado,
    mail: {
      type: "string",
      label: "Email address",
      description:
        "The email address of the user to whom the tags should be assigned or removed",
    },
    tagsAdd: {
      type: "string[]",
      label: "Tags to add",
      description: "A list of tag IDs to assign to the user.",
      optional: true,
    },
    tagsRemove: {
      type: "string[]",
      label: "Tags to remove",
      description: "A list of tag IDs to remove from the user.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.membado.addMember({
      $,
      data: {
        mail: this.mail,
        tags_add: this.tagsAdd?.join?.() ?? this.tagsAdd,
        tags_remove: this.tagsRemove?.join?.() ?? this.tagsRemove,
      },
    });

    $.export(
      "$summary",
      `Successfully changed tags for ${this.mail}`,
    );

    return response;
  },
};
