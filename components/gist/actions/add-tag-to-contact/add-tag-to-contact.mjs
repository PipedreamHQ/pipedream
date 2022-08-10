import gist from "../../gist.app.mjs";

export default {
  ...gist,
  key: "gist-add-tag-to-contact",
  name: "Add Tag To An Existing Contact",
  description: "Add Contact Tag [See docs](https://developers.getgist.com/api/#add-a-tag-to-contacts)",
  type: "action",
  version: "0.0.1",
  props: {
    gist,
    contactId: {
      propDefinition: [
        gist,
        "contactId",
      ],
      type: "integer[]",
    },
    tagId: {
      propDefinition: [
        gist,
        "tagId",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      id: this.tagId.value,
      name: this.tagId.label,
      contacts: this.contactId.map((contactId) => {
        return {
          id: `${contactId}`,
        };
      }),
    };

    const response = await this.gist.updateTagToContact({
      $,
      data,
    });

    $.export("$summary", `Successfully added tag ${this.tagId.label} to contact`);

    return response;
  },
};
