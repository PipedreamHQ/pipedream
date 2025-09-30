import common from "../common/base.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "voilanorbert-start-contact-search",
  name: "Start Contact Search",
  description: `Search emails are based on the full name plus the domain or company name.
  When your account does not have sufficient credits an HTTP status code of 402 is returned.
  Also, take into consideration that we check the domain for its validity. So even if you provide a correct name+domain set, we may return a HTTP status code of 400 for the domain if we can't locate it.
  [See the docs here](https://api.voilanorbert.com/2018-01-08/#search-endpoint-post)`,
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    name: {
      propDefinition: [
        common.props.voilanorbert,
        "name",
      ],
    },
    domain: {
      propDefinition: [
        common.props.voilanorbert,
        "domain",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        common.props.voilanorbert,
        "company",
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        common.props.voilanorbert,
        "listId",
      ],
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The URL to send the webhook to. Required for Pipedream Connect. If not specified, the workflow will be suspended until verification results are returned.",
      optional: true,
    },
  },
  methods: {
    async processEvent({ $ }) {
      if (!this.domain && !this.company) {
        throw new ConfigurationError("Either domain or company is required.");
      }

      const { resume_url } = this.webhookUrl
        ? {
          resume_url: this.webhookUrl,
        }
        : $.flow
          ? $.flow.suspend()
          : {
            resume_url: undefined,
          };
      if (!resume_url) {
        throw new ConfigurationError("Webhook URL is required for Pipedream Connect.");
      }

      const {
        name,
        domain,
        company,
        listId,
      } = this;

      return this.voilanorbert.startContactSearch({
        name,
        domain,
        company,
        webhook: resume_url,
        list_id: listId,
      });
    },
    getSummary() {
      return "Contact Search Successfully fetched!";
    },
  },
};
