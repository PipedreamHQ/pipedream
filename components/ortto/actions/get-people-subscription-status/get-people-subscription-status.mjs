import { ConfigurationError } from "@pipedream/platform";
import app from "../../ortto.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ortto-get-people-subscription-status",
  name: "Get people subscription status",
  description: "Retrieves subscription statuses from one or more person records in Ortto’s customer data platform (CDP). [See the docs](https://help.ortto.com/developer/latest/api-reference/person/subscriptions.html).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    emails: {
      type: "string[]",
      label: "List of Emails",
      description: "The email addresses of the people whose subscription statuses you wish to retrieve.",
    },
  },
  methods: {
    getResourceFnArgs(step) {
      return {
        step,
        data: {
          people: this.emails.map((email) => ({
            email,
          })),
        },
      };
    },
    getResourcesName() {
      return "people";
    },
    getSubscriptions(step) {
      const stream = this.app.getResourcesStream({
        resourceFn: this.app.listPeopleSubscriptions,
        resourceFnArgs: this.getResourceFnArgs(step),
        resourcesName: this.getResourcesName(),
      });
      return utils.streamIterator(stream);
    },
  },
  async run({ $: step }) {
    if (!Array.isArray(this.emails)) {
      throw new ConfigurationError("The property `emails` should be an array of strings");
    }

    const subscriptions = await this.getSubscriptions(step);

    step.export("$summary", `Successfully fetched ${utils.summaryEnd(subscriptions.length, "subscription status", "subscription statuses")}`);

    return subscriptions;
  },
};
