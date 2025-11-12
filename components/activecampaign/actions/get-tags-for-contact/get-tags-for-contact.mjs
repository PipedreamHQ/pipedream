import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-get-tags-for-contact",
  name: "Get Contact Tags",
  description: "Get Contact Tags.",
  version: "0.3.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    activecampaign,
    contactId: {
      type: "string",
      description: "ID of the contact to retrieve.",
      propDefinition: [
        activecampaign,
        "contacts",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const { contactId } = this;

    const { contactTags } = await this.activecampaign.getContactTags({
      contactId,
    });

    $.export("$summary", `Successfully listed ${contactTags.length} contact tag(s)`);

    return contactTags;
  },
};
