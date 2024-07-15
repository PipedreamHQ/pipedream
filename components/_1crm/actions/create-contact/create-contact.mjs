import { axios } from "@pipedream/platform";
import _1crm from "../../_1crm.app.mjs";

export default {
  key: "_1crm-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in the 1CRM system. [See the documentation](https://demo.1crmcloud.com/api.php)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    _1crm,
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
        {
          optional: true,
        },
      ],
    },
    address: {
      propDefinition: [
        _1crm,
        "address",
        {
          optional: true,
        },
      ],
    },
    phoneNumber: {
      propDefinition: [
        _1crm,
        "phoneNumber",
        {
          optional: true,
        },
      ],
    },
  },
  async run({ $ }) {
    const response = await this._1crm.createContact({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      address: this.address,
      phoneNumber: this.phoneNumber,
    });
    $.export("$summary", `Successfully created contact with ID ${response.id}`);
    return response;
  },
};
