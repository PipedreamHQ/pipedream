import { removeNullEntries } from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-get-a-list",
  name: "List List's Activities",
  description: "Retrieves up to the previous 180 days of daily detailed aggregated activity stats for a list. [See docs here](https://mailchimp.com/developer/marketing/api/list-activity/list-recent-activity/)",
  version: "0.0.1",
  type: "action",
  props: {
    mailchimp,
    listId: {
      type: "string",
      label: "List id",
      description: "The unique ID for the list.",
    },
    count: {
      type: "integer",
      label: "Count",
      max: 10,
      min: 1,
      default: 10,
      description: "The number of records to return.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "A string list of fields to return. Reference parameters of sub-objects with dot notation.",
      optional: true,
    },
    excludeFields: {
      type: "string[]",
      label: "Exclude Fields",
      description: "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation.",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = removeNullEntries({
      listId: this.listId,
      fields: this.fields.join(","),
      exclude_fields: this.excludeFields.join(","),
      count: this.count,
    });
    const response = await this.mailchimp.getList($, payload);
    response && $.export("$summary", "List found");
    return response;
  },
};
