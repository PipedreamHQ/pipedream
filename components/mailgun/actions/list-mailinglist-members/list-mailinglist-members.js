const pick = require("lodash.pick");
const mailgun = require("../../mailgun.app.js");

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
    haltOnError: {
      propDefinition: [
        mailgun,
        "haltOnError",
      ],
    },
  },
  async run () {
    try {
      return await this.mailgun.paginate(
        params => this.mailgun.api("lists").members.getMembers(this.list, {
          ...pick(this, [
            "subscribed",
          ]),
          ...params,
        })
      );
    } catch (err) {
      if (this.haltOnError) {
        throw err;
      }
      return err;
    }
  },
};
