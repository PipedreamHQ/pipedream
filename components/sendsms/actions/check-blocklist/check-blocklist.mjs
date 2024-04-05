import sendsms from "../../sendsms.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sendsms-check-blocklist",
  name: "Check Blocklist",
  description: "Checks if a specific phone number is in the blocklist. [See the documentation](https://www.sendsms.ro/api/)",
  version: "0.0.1",
  type: "action",
  props: {
    sendsms,
    phoneNumberToCheck: {
      propDefinition: [
        sendsms,
        "phoneNumberToCheck",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sendsms.checkBlocklist({
      phoneNumberToCheck: this.phoneNumberToCheck,
    });

    const summaryMessage = response.status === 0
      ? `The phone number ${this.phoneNumberToCheck} is not in the blocklist`
      : `The phone number ${this.phoneNumberToCheck} is in the blocklist`;

    $.export("$summary", summaryMessage);
    return response;
  },
};
