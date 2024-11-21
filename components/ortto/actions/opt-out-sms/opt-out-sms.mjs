import ortto from "../../ortto.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ortto-opt-out-sms",
  name: "Opt Out of SMS",
  description: "Allows a user to opt-out from all SMS communications. [See the documentation](https://help.ortto.com/a-250-api-reference)",
  version: "0.0.1",
  type: "action",
  props: {
    ortto,
    userId: {
      propDefinition: [
        ortto,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ortto.optOutSMS({
      pathParams: {
        userId: this.userId,
      },
    });

    $.export("$summary", `Successfully opted out SMS for User ID: ${this.userId}`);
    return response;
  },
};
