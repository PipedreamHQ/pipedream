import smstools from "../../smstools.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "smstools-add-contact-opt-out",
  name: "Add Contact to Opt-Out List",
  description: "Adds a selected contact to the opt-out list, stopping further communications. [See the documentation](https://www.smstools.com/en/sms-gateway-api/add_optout)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    smstools,
    contact: {
      propDefinition: [
        smstools,
        "contact",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.smstools.addOptOut({
      contactid: this.contact,
    });

    $.export("$summary", `Successfully added contact with ID ${this.contact} to the opt-out list.`);
    return response;
  },
};
