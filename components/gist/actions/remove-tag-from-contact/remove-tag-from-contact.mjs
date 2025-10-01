import gist from "../../gist.app.mjs";

export default {
  key: "gist-remove-tag-from-contact",
  name: "Remove Tag From Existing Contact",
  description: "Remove a tag from an existing contact or contacts. [See docs](https://developers.getgist.com/api/#remove-a-tag-from-contacts)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    gist,
    tagId: {
      propDefinition: [
        gist,
        "tagId",
      ],
      withLabel: true,
    },
    contactId: {
      propDefinition: [
        gist,
        "contactId",
        (c) => ({
          tagId: c.tagId.value,
        }),
      ],
      type: "integer[]",
    },
  },
  async run({ $ }) {
    const data = {
      id: this.tagId.value,
      name: this.tagId.label,
      contacts: this.contactId.map((contactId) => ({
        id: `${contactId}`,
        untag: true,
      })),
    };

    const response = await this.gist.updateTagToContact({
      $,
      data,
    });

    $.export("$summary", `Successfully removed tag ${this.tagId.label} from contact${
      this.contactId.length > 1
        ? "s"
        : ""
    }`);

    return response;
  },
};
