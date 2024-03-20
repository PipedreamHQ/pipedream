import clicksend from "../../clicksend.app.mjs";

export default {
  key: "clicksend-create-contact",
  name: "Create Contact",
  description: "Creates a new contact on your ClickSend account",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    clicksend,
    contact: {
      propDefinition: [
        clicksend,
        "contact",
      ],
    },
    customFields: {
      propDefinition: [
        clicksend,
        "customFields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.clicksend.createContact({
      contact: this.contact,
      customFields: this.customFields,
    });
    $.export("$summary", `Successfully created contact with ID: ${response.data.contact_id}`);
    return response;
  },
};
