import _1crm from "../../_1crm.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "_1crm-update-contact",
  name: "Update Contact",
  description: "Modifies an existing contact within the 1CRM system. [See the documentation](https://demo.1crmcloud.com/api.php)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    _1crm,
    contactId: {
      propDefinition: [
        _1crm,
        "contactId",
      ],
    },
    firstName: {
      propDefinition: [
        _1crm,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        _1crm,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        _1crm,
        "email",
      ],
    },
    address: {
      propDefinition: [
        _1crm,
        "address",
      ],
    },
    phoneNumber: {
      propDefinition: [
        _1crm,
        "phoneNumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this._1crm.updateContact({
      contactId: this.contactId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      address: this.address,
      phoneNumber: this.phoneNumber,
    });

    $.export("$summary", `Successfully updated contact with ID ${this.contactId}`);
    return response;
  },
};
