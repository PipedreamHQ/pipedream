import common from "../common/base.mjs";

export default {
  ...common,
  key: "voilanorbert-start-contact-search",
  name: "Start Contact Search",
  description: `Search emails are based on the full name plus the domain or company name.
  When your account does not have sufficient credits an HTTP status code of 402 is returned.
  Also, take into consideration that we check the domain for its validity. So even if you provide a correct name+domain set, we may return a HTTP status code of 400 for the domain if we can't locate it.
  [See the docs here](https://api.voilanorbert.com/2018-01-08/#search-endpoint-post)`,
  version: "0.0.1",
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
  },
  methods: {
    async processEvent({ $ }) {
      const { resume_url } = $.flow.suspend();
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
