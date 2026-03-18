import {
  commaSeparateArray, removeNullEntries,
} from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-get-list-activities",
  name: "Get List Activities",
  description: "Retrieves up to the previous 180 days of daily detailed aggregated activity stats for a list. [See docs here](https://mailchimp.com/developer/marketing/api/list-activity/list-recent-activity/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mailchimp,
    listId: {
      propDefinition: [
        mailchimp,
        "listId",
      ],
      label: "List Id",
      description: "The unique ID of the list",
    },
    count: {
      propDefinition: [
        mailchimp,
        "count",
      ],
    },
    fields: {
      propDefinition: [
        mailchimp,
        "fields",
      ],
    },
    excludeFields: {
      propDefinition: [
        mailchimp,
        "excludeFields",
      ],
    },
  },
  async run({ $ }) {
    const payload = removeNullEntries({
      listId: this.listId,
      fields: commaSeparateArray(this.fields),
      exclude_fields: commaSeparateArray(this.excludeFields),
      count: this.count,
    });
    const response = await this.mailchimp.getListActivities($, payload);
    response && $.export("$summary", "List activities found");
    return response;
  },
};
