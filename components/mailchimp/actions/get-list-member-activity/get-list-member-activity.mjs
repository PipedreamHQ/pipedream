import {
  commaSeparateArray,
  removeNullEntries, validateObject,
} from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-get-list-member-activity",
  name: "Get List Member Activities",
  description: "Get the last 50 events of a member's activity on a specific list. [See docs here](https://mailchimp.com/developer/marketing/api/list-activity/view-recent-activity-50/)",
  version: "0.0.2",
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
    subscriberHash: {
      type: "string",
      label: "Subscriber hash",
      description: "The MD5 hash of the lowercase version of the list member's email address. This endpoint also accepts a list member's email address or contact_id.",
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
    action: {
      type: "object",
      label: "Action",
      description: "A comma separated list of actions to return. Possible values: abuse, bounce, click, open, sent, unsub, or ecomm.",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = removeNullEntries({
      listId: this.listId,
      fields: commaSeparateArray(this.fields),
      exclude_fields: commaSeparateArray(this.excludeFields),
      action: validateObject(this.action),
      subscriberHash: this.subscriberHash,
    });
    const response = await this.mailchimp.getListMemberActivities($, payload);
    response && $.export("$summary", "List member's activities found");
    return response;
  },
};
