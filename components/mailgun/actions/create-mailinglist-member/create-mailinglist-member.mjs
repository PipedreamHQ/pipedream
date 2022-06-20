import mailgun from "../../mailgun.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "mailgun-create-mailinglist-member",
  name: "Create Mailing List Member",
  description: "Add to an existing mailing list",
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
    ...common.props,
  },
  async run() {
    return await this.withErrorHandler(this.mailgun.createMailinglistMember, {
      address: this.address,
      name: this.name,
      subscribed: this.subscribed,
      upsert: this.upsert,
      vars: this.vars,
      list: this.list,
    });
  },
};
