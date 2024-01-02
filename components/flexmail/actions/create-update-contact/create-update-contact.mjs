import flexmail from "../../flexmail.app.mjs";

export default {
  key: "flexmail-create-update-contact",
  name: "Create or Update Contact",
  description: "Creates or updates a contact within Flexmail using specified properties.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    flexmail,
    contactId: {
      propDefinition: [
        flexmail,
        "contactId",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        flexmail,
        "email",
      ],
    },
    name: {
      propDefinition: [
        flexmail,
        "name",
      ],
    },
    phoneNumber: {
      propDefinition: [
        flexmail,
        "phoneNumber",
      ],
    },
    additionalInfo: {
      propDefinition: [
        flexmail,
        "additionalInfo",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      email: this.email,
      name: this.name,
      phoneNumber: this.phoneNumber,
      additionalInfo: this.additionalInfo,
    };

    let response;
    if (this.contactId) {
      response = await this.flexmail.updateContact({
        contactId: this.contactId,
        data,
      });
    } else {
      response = await this.flexmail.createContact({
        data,
      });
    }

    $.export("$summary", `Successfully ${this.contactId
      ? "updated"
      : "created"} contact ${response.id}`);
    return response;
  },
};
