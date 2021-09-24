const mailgun = require("../../mailgun.app.js");
const pick = require("lodash.pick");
const {
  props,
  methods,
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
  methods: {
    ...methods,
  },
  async run() {
    const createMailinglistMember = async function (mailgun, opts) {
      const data = pick(opts, [
        "address",
        "name",
        "subscribed",
        "upsert",
      ]);
      const vars = JSON.stringify(opts.vars);
      if (vars) {
        data.vars = vars;
      }
      return await mailgun.api("lists").members.createMember(opts.list, data);
    };
    return await this.withErrorHandler(createMailinglistMember, {
      address: this.address,
      name: this.name,
      subscribed: this.subscribed,
      upsert: this.upsert,
      vars: this.vars,
      list: this.list,
    });
  },
};
