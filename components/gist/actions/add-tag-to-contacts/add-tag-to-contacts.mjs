import gist from "../../gist.app.mjs";

export default {
  key: "gist-add-tag-to-contacts",
  name: "Add Tag To Existing Contacts",
  description: "This Action lets you assign a tag to multiple contacts at once. If the tag does not already exist it will be created for you. [See docs](https://developers.getgist.com/api/#add-a-tag-to-contacts)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      withLabel: true,
    },
  },
  async run({ $ }) {
    const data = {
      id: this.tagId.value,
      name: this.tagId.label || this.tagId,
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

    $.export("$summary", `Successfully added tag ${this.tagId.label || this.tagId} to contact`);

    return response;
  },
};
