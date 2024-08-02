import whautomate from "../../whautomate.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "whautomate-create-contact",
  name: "Create Contact",
  description: "Create a new contact associated with a WhatsApp number. [See the documentation](https://help.whautomate.com/product-guides/whautomate-rest-api/contacts)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    whautomate,
    name: {
      propDefinition: [
        whautomate,
        "name",
      ],
    },
    phoneNumber: {
      propDefinition: [
        whautomate,
        "phoneNumber",
      ],
    },
    email: {
      propDefinition: [
        whautomate,
        "email",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      name, phoneNumber, email,
    } = this;

    const response = await this.whautomate.createNewContact({
      name,
      phoneNumber,
      email,
    });

    $.export("$summary", `Successfully created contact with ID ${response.id}`);
    return response;
  },
};
