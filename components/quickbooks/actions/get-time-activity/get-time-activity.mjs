import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-time-activity",
  name: "Get Time Activity",
  description: "Returns info about an activity. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/timeactivity#read-a-timeactivity-object)",
  version: "0.1.4",
  type: "action",
  props: {
    quickbooks,
    timeActivityId: {
      label: "Time Activity ID",
      type: "string",
      description: "Id of the time activity object to get details of.",
    },
    minorVersion: {
      propDefinition: [
        quickbooks,
        "minorVersion",
      ],
    },
  },
  async run({ $ }) {
    if (!this.timeActivityId) {
      throw new ConfigurationError("Must provide timeActivityId parameter.");
    }

    const response = await this.quickbooks.getTimeActivity({
      $,
      timeActivityId: this.timeActivityId,
      params: {
        minorversion: this.minorVersion,
      },
    });

    if (response) {
      $.export("summary", `Successfully retrieved time activity with id ${response.TimeActivity.Id}`);
    }

    return response;
  },
};
