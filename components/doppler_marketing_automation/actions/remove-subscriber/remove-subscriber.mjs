import dopplerMarketingAutomation from "../../doppler_marketing_automation.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "doppler_marketing_automation-remove-subscriber",
  name: "Remove Subscriber",
  description: "Removes a subscriber from a list completely. [See the documentation](https://restapi.fromdoppler.com/docs/resources)",
  version: "0.0.1",
  type: "action",
  props: {
    dopplerMarketingAutomation,
    listId: {
      propDefinition: [
        dopplerMarketingAutomation,
        "listId",
      ],
    },
    subscriberEmail: {
      propDefinition: [
        dopplerMarketingAutomation,
        "subscriberEmail",
        ({ listId }) => ({
          listId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dopplerMarketingAutomation.removeSubscriber({
      email: this.subscriberEmail,
      listId: this.listId,
    });
    $.export("$summary", `Successfully removed subscriber: ${this.subscriberEmail} from list: ${this.listId}`);
    return response;
  },
};
