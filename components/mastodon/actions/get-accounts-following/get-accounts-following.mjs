import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-get-accounts-following",
  name: "Get Accounts Following",
  description: "Get the accounts that the given account is following. [See the documentation](https://docs.joinmastodon.org/methods/accounts/#following)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mastodon,
    max: {
      propDefinition: [
        mastodon,
        "max",
      ],
    },
    maxId: {
      type: "string",
      label: "Max ID",
      description: "The max ID from a previous response for pagination",
      optional: true,
    },
    minId: {
      type: "string",
      label: "Min ID",
      description: "The min ID from a previous response for pagination",
      optional: true,
    },
    sinceId: {
      type: "string",
      label: "Since ID",
      description: "The since ID from a previous response for pagination",
      optional: true,
    },
  },
  methods: {
    getMaxIdFromLinkHeader(linkHeader) {
      const match = linkHeader.match(/max_id=([^&>]+)/);
      return match
        ? match[1]
        : null;
    },
  },
  async run({ $ }) {
    const { max } = this;
    const accounts = [];
    let done = false, paginationLinks;
    const args = {
      $,
      params: {
        max_id: this.maxId,
        min_id: this.minId,
        since_id: this.sinceId,
        limit: 80, // max allowed by api
      },
      returnFullResponse: true,
    };
    do {
      const {
        headers, data,
      } = await this.mastodon.getAccountsFollowing(args);
      accounts.push(...data);
      if (headers?.link) {
        args.params.max_id = this.getMaxIdFromLinkHeader(headers.link);
        paginationLinks = headers.link;
      } else {
        done = true;
      }
      if (data?.length < args.params.limit) {
        done = true;
      }
    } while (accounts.length < max && !done);

    if (accounts.length > max) {
      accounts.length = max;
    }

    $.export("$summary", `Successfully retrieved ${accounts.length} account(s) that the user is following`);
    return {
      accounts,
      paginationLinks,
    };
  },
};
