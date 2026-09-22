import chargekeep from "../../chargekeep.app.mjs";

export default {
  key: "chargekeep-get-contact-info",
  name: "Get Contact Info",
  description: "Get contact information from Chargekeep. [See the documentation](https://crm.chargekeep.com/app/api/swagger)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    chargekeep,
    contactId: {
      propDefinition: [
        chargekeep,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chargekeep.getContactInfo({
      $,
      params: {
        contactId: this.contactId,
      },
    });

    $.export("$summary", `Successfully fetched contact info for contact ID ${this.contactId}`);
    return response;
  },
};
