import gist from "../../gist.app.mjs";

export default {
  ...gist,
  key: "gist-remove-tag-from-contact",
  name: "Remove Tag From Existing Contact",
  description: "Remove a tag from an existing contact or contacts. [See docs](https://developers.getgist.com/api/#remove-a-tag-from-contacts)",
  type: "action",
  version: "0.0.1",
  props: {
    gist,
    tagId: {
      propDefinition: [
        gist,
        "tagId",
      ],
      type: "string",
    },
    contactId: {
      propDefinition: [
        gist,
        "contactId",
        (c) => ({
          tagId: c.tagId,
        }),
      ],
      type: "integer[]",
    },
  },
  async run({ $ }) {
    const tag = JSON.parse(this.tagId);
    const data = {
      ...tag,
      contacts: this.contactId.map((contactId) => {
        return {
          id: `${contactId}`,
          untag: true,
        };
      }),
    };

    const response = await this.gist.updateTagToContact({
      $,
      data,
    });

    $.export("$summary", `Successfully removed tag ${tag.name} from contact${
      this.contactId.lenght
        ? "s"
        : ""
    }`);

    return response;
  },
};
