import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-tag-contact",
  name: "Tag Contact",
  description: "Tags a contact. See the docs [here](https://developers.activecampaign.com/reference/create-contact-tag).",
  version: "0.3.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    activecampaign,
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Contact id",
      optional: false,
      propDefinition: [
        activecampaign,
        "contacts",
      ],
    },
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "Tag id",
      optional: false,
      propDefinition: [
        activecampaign,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const {
      contactId,
      tagId,
    } = this;

    const response = await this.activecampaign.createContactTag({
      data: {
        contactTag: {
          contact: contactId,
          tag: tagId,
        },
      },
    });

    $.export("$summary", `Successfully added a tag to contact with ID ${response.contactTag.id}`);

    return response;
  },
};
