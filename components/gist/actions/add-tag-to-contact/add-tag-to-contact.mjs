import gist from "../../gist.app.mjs";

export default {
  ...gist,
  key: "gist-add-tag-to-contact",
  name: "Add Tag To An Existing Contact",
  description: "Add Contact Tag",
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
      type: "string",
    },
  },
  async run({ $ }) {
    let tag = {};
    try {
      tag = {
        ...JSON.parse(this.tagId),
      };
    } catch (e) {
      tag.name = this.tagId;
    }

    const data = {
      ...tag,
      contacts: this.contactId.map((contactId) => {
        return {
          id: `${contactId}`,
        };
      }),
    };

    const response = await this.gist.addTagToContact({
      $,
      data,
    });

    $.export("$summary", `Successfully added tag ${tag.name} to contact`);

    return response;
  },
};
