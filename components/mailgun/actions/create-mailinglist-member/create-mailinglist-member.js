const pick = require("lodash.pick");
const mailgun = require("../../mailgun.app.js");
const {
  props,
  withErrorHandler,
} = require("../common");

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
    /* eslint-disable pipedream/default-value-required-for-optional-props */
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
    /* eslint-enable pipedream/default-value-required-for-optional-props */
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
    ...props,
  },
  run: withErrorHandler (
    async function () {
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
    },
  ),
};
