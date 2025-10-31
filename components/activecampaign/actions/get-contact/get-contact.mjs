import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-get-contact",
  name: "Get Contact",
  description: "Retrieves an existing contact. See the docs [here](https://developers.activecampaign.com/reference/get-contact).",
  version: "0.2.2",
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
    },
  },
  async run({ $ }) {
    const { contactId } = this;

    const response = await this.activecampaign.getContact({
      contactId,
    });

    $.export("$summary", `Successfully found contact with ID ${response.contact.id}`);

    return response;
  },
};
