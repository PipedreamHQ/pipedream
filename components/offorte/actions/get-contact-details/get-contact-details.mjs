import offorte from "../../offorte.app.mjs";

export default {
  key: "offorte-get-contact-details",
  name: "Get Contact Details",
  description: "Get the details of a contact in Offorte. [See the documentation](https://www.offorte.com/api-docs/api#tag/Contacts/operation/contactDetails)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    offorte,
    contactId: {
      propDefinition: [
        offorte,
        "contactId",
        () => ({
          fieldId: "contact_id",
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.offorte.getContactDetails({
      $,
      contactId: this.contactId,
    });

    $.export("$summary", `Fetched contact details for ${this.contactId}`);
    return response;
  },
};
