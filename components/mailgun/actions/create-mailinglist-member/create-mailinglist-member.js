const pick = require("lodash.pick");
const mailgun = require("../../mailgun.app.js");

module.exports = {
  key: "mailgun-create-mailinglist-member",
  name: "Mailgun Create Mailing List Member",
  description: "Add to an existing mailing list",
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
    address: {
      propDefinition: [
        mailgun,
        "email",
      ],
    },
    name: {
      propDefinition: [
        mailgun,
        "name",
      ],
      optional: true,
    },
    vars: {
      propDefinition: [
        mailgun,
        "vars",
      ],
      optional: true,
    },
    subscribed: {
      propDefinition: [
        mailgun,
        "subscribed",
      ],
      description: "If `no`, will add unsubscribed",
      default: "yes",
    },
    upsert: {
      propDefinition: [
        mailgun,
        "upsert",
      ],
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
      const data = pick(this, [
        "address",
        "name",
        "subscribed",
        "upsert",
      ]);
      const vars = JSON.stringify(this.vars);
      if (vars) {
        data.vars = vars;
      }
      return await this.mailgun.api("lists").members.createMember(this.list, data);
    } catch (err) {
      if (this.haltOnError) {
        throw err;
      }
      return err;
    }
  },
};
