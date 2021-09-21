const pick = require("lodash.pick");
const mailgun = require("../../mailgun.app.js");
const {
  props,
  withErrorHandler,
} = require("../common");

module.exports = {
  key: "mailgun-list-domains",
  name: "Mailgun List Domains",
  description: "List all domains in Mailgun",
  version: "0.0.1",
  type: "action",
  props: {
    mailgun,
    /* eslint-disable pipedream/default-value-required-for-optional-props */
    authority: {
      type: "string",
      label: "DKIM Authority",
      description: "Filter by DKIM authority",
      optional: true,
    },
    state: {
      type: "string",
      label: "Status",
      description: "Filter by status",
      options: [
        "active",
        "unverified",
        "disabled",
      ],
      optional: true,
    },
    /* eslint-enable pipedream/default-value-required-for-optional-props */
    ...props,
  },
  run: withErrorHandler(
    async function () {
      return await this.mailgun.paginate(
        (params) => this.mailgun.api("domains").list({
          ...pick(this, [
            "authority",
            "state",
          ]),
          ...params,
        }),
      );
    },
  ),
};
