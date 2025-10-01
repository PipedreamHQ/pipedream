import mailgun from "../../mailgun.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "mailgun-list-mailinglist-members",
  name: "Get Mailing List Members",
  description: "List all mailing list members. [See the docs here](https://documentation.mailgun.com/en/latest/api-mailinglists.html#mailing-lists)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mailgun,
    list: {
      propDefinition: [
        mailgun,
        "list",
      ],
    },
    /* eslint-disable pipedream/default-value-required-for-optional-props */
    subscribed: {
      propDefinition: [
        mailgun,
        "subscribed",
      ],
      description: "`true` for subscribed only, `false` for unsubscribed only, or blank for all members",
      optional: true,
    },
    /* eslint-enable pipedream/default-value-required-for-optional-props */
    ...common.props,
  },
  async run({ $ }) {
    const resp = await this.withErrorHandler(this.mailgun.listMailingListMembers, {
      list: this.list,
      subscribed: this.subscribed,
    });
    $.export("$summary", `Found ${resp.length} mailing list member(s)`);
    return resp;
  },
};
