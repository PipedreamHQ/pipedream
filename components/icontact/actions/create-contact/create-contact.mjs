import icontact from "../../icontact.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "icontact-create-contact",
  name: "Create Contact",
  description: "Creates a new contact within the iContact account. [See the documentation](https://help.icontact.com/customers/s/article/contacts-icontact-api)",
  version: "0.0.1",
  type: "action",
  props: {
    icontact,
    contactEmail: {
      propDefinition: [
        icontact,
        "contactEmail",
      ],
    },
    contactInfo: {
      propDefinition: [
        icontact,
        "contactInfo",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        icontact,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        icontact,
        "lastName",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.icontact.createContact({
      contactEmail: this.contactEmail,
      contactInfo: this.contactInfo || {},
      firstName: this.firstName,
      lastName: this.lastName,
    });

    $.export("$summary", `Successfully created contact with email ${this.contactEmail}`);
    return response;
  },
};
