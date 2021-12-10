const pick = require("lodash.pick");
const mailgun = require("../../mailgun.app.js");
const {
  props,
  methods,
} = require("../common");

module.exports = {
  key: "mailgun-list-domains",
  name: "List Domains",
  description: "List domains in Mailgun",
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
      default: "active",
    },
    /* eslint-enable pipedream/default-value-required-for-optional-props */
    ...props,
  },
  methods: {
    ...methods,
  },
  async run() {
    const listDomains = async function (mailgun, opts) {
      return await mailgun.paginate(
        (params) => mailgun.api("domains").list({
          ...pick(opts, [
            "authority",
            "state",
          ]),
          ...params,
        }),
      );
    };
    return await this.withErrorHandler(listDomains, {
      authority: this.authority,
      state: this.state,
    });
  },
};
