import { clearObj } from "../../common/utils.mjs";
import peach from "../../peach.app.mjs";

export default {
  key: "peach-create-contact",
  name: "Create Contact",
  description: "Creates a contact in your account. [See the documentation](https://peach.apidocumentation.com/reference#tag/contacts/post/subscribers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    peach,
    phoneNumber: {
      propDefinition: [
        peach,
        "phoneNumber",
      ],
    },
    contactName: {
      propDefinition: [
        peach,
        "contactName",
      ],
      optional: true,
    },
    contactEmail: {
      propDefinition: [
        peach,
        "contactEmail",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.peach.createContact({
      $,
      data: clearObj({
        name: this.contactName,
        email: this.contactEmail,
        phone_number: this.phoneNumber,
      }),
    });

    $.export("$summary", `Created the contact successfully with waId: ${this.phoneNumber}`);
    return response;
  },
};
