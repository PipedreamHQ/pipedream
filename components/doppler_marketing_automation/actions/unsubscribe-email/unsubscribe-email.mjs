import dopplerMarketingAutomation from "../../doppler_marketing_automation.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "doppler_marketing_automation-unsubscribe-email",
  name: "Unsubscribe Email",
  description: "Unsubscribe an email address from the mailing list. Once unsubscribed, the user will not receive any more communication. [See the documentation](https://restapi.fromdoppler.com/docs/)",
  version: "0.0.1",
  type: "action",
  props: {
    dopplerMarketingAutomation,
    subscriberEmail: {
      propDefinition: [
        dopplerMarketingAutomation,
        "subscriberEmail",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dopplerMarketingAutomation.unsubscribeSubscriber({
      email: this.subscriberEmail,
    });
    $.export("$summary", `Successfully unsubscribed email: ${this.subscriberEmail}`);
    return response;
  },
};
