const pick = require("lodash.pick");
const mailgun = require("../../mailgun.app.js");
const { props, withErrorHandler } = require("../common");

module.exports = {
  key: "mailgun-list-mailinglist-members",
  name: "Mailgun Get Mailing List Members",
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
    subscribed: {
      propDefinition: [
        mailgun,
        "subscribed",
      ],
      description: "`yes` for subscribed only, `no` for unsubscribed only, or blank for " +
        "all members",
      optional: true,
    },
    ...props,
  },
  run: withErrorHandler(
    async function () {
      return await this.mailgun.paginate(
        params => this.mailgun.api("lists").members.getMembers(this.list, {
          ...pick(this, [
            "subscribed",
          ]),
          ...params,
        })
      );
    }
  )
};
