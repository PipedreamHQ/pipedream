import belco from "../../belco.app.mjs";

export default {
  key: "belco-get-contact-details",
  name: "Get Contact Details",
  description: "Get the details of a contact in Belco. [See the documentation](https://developers.belco.io/reference/get_shops-shopid-contacts-contactid)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    belco,
    shopId: {
      propDefinition: [
        belco,
        "shopId",
      ],
    },
    contactId: {
      propDefinition: [
        belco,
        "to",
        ({ shopId }) => ({
          shopId,
        }),
      ],
      label: "Contact ID",
      description: "The ID of the contact to get details for",
    },
  },
  async run({ $ }) {
    const response = await this.belco.getContact({
      $,
      shopId: this.shopId,
      contactId: this.contactId,
    });
    $.export("$summary", `Successfully retrieved contact details for ${this.contactId}`);
    return response;
  },
};
