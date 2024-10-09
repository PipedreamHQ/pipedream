import dopplerMarketingAutomation from "../../doppler_marketing_automation.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "doppler_marketing_automation-add-update-subscriber",
  name: "Add or Update Subscriber",
  description: "Adds a new subscriber or updates an existing one. [See the documentation](https://restapi.fromdoppler.com/docs/resources)",
  version: "0.0.{{ts}}",
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
      type: "string",
      label: "Subscriber Email",
      description: "The email of the subscriber to add or update.",
    },
    fields: {
      propDefinition: [
        dopplerMarketingAutomation,
        "fields",
      ],
    },
    origin: {
      propDefinition: [
        dopplerMarketingAutomation,
        "origin",
      ],
    },
    name: {
      propDefinition: [
        dopplerMarketingAutomation,
        "name",
      ],
    },
    country: {
      propDefinition: [
        dopplerMarketingAutomation,
        "country",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dopplerMarketingAutomation.addOrUpdateSubscriber({
      email: this.subscriberEmail,
      fields: this.fields,
      name: this.name,
      country: this.country,
      origin: this.origin,
    });

    $.export("$summary", `Successfully added or updated subscriber with email: ${this.subscriberEmail}`);
    return response;
  },
};
