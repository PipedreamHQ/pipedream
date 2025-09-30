import { ConfigurationError } from "@pipedream/platform";
import smstools from "../../smstools.app.mjs";

export default {
  key: "smstools-add-contact-opt-out",
  name: "Add Contact to Opt-Out List",
  description: "Adds a selected contact to the opt-out list, stopping further communications. [See the documentation](https://www.smstools.com/en/sms-gateway-api/add_optout)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smstools,
    contactNumber: {
      propDefinition: [
        smstools,
        "contactNumber",
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.smstools.addOptOut({
        $,
        data: {
          number: this.contactNumber,
        },
      });

      $.export("$summary", `Successfully added contact number ${this.contactNumber} to the opt-out list.`);
      return response;
    } catch (e) {
      throw new ConfigurationError("The number is already opted-out or does not exist in the database.");
    }
  },
};
