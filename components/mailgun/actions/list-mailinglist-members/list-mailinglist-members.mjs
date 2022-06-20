import mailgun from "../../mailgun.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "mailgun-list-mailinglist-members",
  name: "Get Mailing List Members",
  description: "List all mailing list members",
  version: "0.0.2",
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
      description: "`true` for subscribed only, `false` for unsubscribed only, or blank for " +
        "all members",
      optional: true,
    },
    /* eslint-enable pipedream/default-value-required-for-optional-props */
    ...common.props,
  },
  async run() {
    const listMailinglistMembers = async function (mailgun, opts) {
      let data;
      if (opts.subscribed) {
        data = {
          subscribed: opts.subscribed,
        };
      }
      return await mailgun.api("lists").members.listMembers(opts.list, data);
    };
    return await this.withErrorHandler(listMailinglistMembers, {
      list: this.list,
      subscribed: this.subscribed,
    });
  },
};
