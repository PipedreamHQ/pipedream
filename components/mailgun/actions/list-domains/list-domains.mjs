import { pick } from "lodash";
import mailgun from "../../mailgun.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "mailgun-list-domains",
  name: "List Domains",
  description: "List domains in Mailgun. [See the docs here](https://documentation.mailgun.com/en/latest/api-domains.html#domains)",
  version: "0.0.2",
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
    ...common.props,
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
