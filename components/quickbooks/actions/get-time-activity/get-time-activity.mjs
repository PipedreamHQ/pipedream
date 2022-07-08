import quickbooks from "../../quickbooks.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks-get-time-activity",
  name: "Get Time Activity",
  description: "Returns info about an activity.",
  version: "0.1.2",
  type: "action",
  props: {
    quickbooks,
    timeActivityId: {
      label: "Time Activity ID",
      type: "string",
      description: "Id of the time activity object to get details of.",
    },
    minorversion: {
      label: "Minor Version",
      type: "string",
      description: "Use the `minorversion` query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.timeActivityId) {
      throw new Error("Must provide timeActivityId parameter.");
    }

    return await axios($, {
      url: `https://quickbooks.api.intuit.com/v3/company/${this.quickbooks.$auth.company_id}/timeactivity/${this.timeActivityId}`,
      headers: {
        "Authorization": `Bearer ${this.quickbooks.$auth.oauth_access_token}`,
        "content-type": "application/json",
      },
      params: {
        minorversion: this.minorversion,
      },
    });
  },
};
