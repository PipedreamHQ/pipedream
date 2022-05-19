import { removeNullEntries } from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-get-a-list",
  name: "List Lists Activities",
  description: "Retrieves up to the previous 180 days of daily detailed aggregated activity stats for a list. [See docs here](https://mailchimp.com/developer/marketing/api/list-activity/list-recent-activity/)",
  version: "0.0.1",
  type: "action",
  props: {
    mailchimp,
    listId: {
      type: "string",
      label: "List ID",
      description: "The unique ID for the list.",
    },
    count: {
      propDefinition: [
        mailchimp,
        "excludeFields",
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
      fields: this.fields.join(","),
      exclude_fields: this.excludeFields.join(","),
      count: this.count,
    });
    const response = await this.mailchimp.getList($, payload);
    response && $.export("$summary", "List activities found");
    return response;
  },
};
