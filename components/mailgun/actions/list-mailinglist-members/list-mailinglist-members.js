const mailgun = require("../../mailgun.app.js");
const {
  props,
  methods,
} = require("../common");

module.exports = {
  key: "mailgun-list-mailinglist-members",
  name: "Get Mailing List Members",
  description: "List all mailing list members",
  version: "0.0.1",
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
    ...props,
  },
  methods: {
    ...methods,
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
