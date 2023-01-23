// legacy_hash_id: a_8KiV84
import { axios } from "@pipedream/platform";

export default {
  key: "trello-search-members",
  name: "Search Members",
  description: "Search for Trello members.",
  version: "0.1.2",
  type: "action",
  props: {
    trello: {
      type: "app",
      app: "trello",
    },
    query: {
      type: "string",
      description: "Search query 1 to 16384 characters long",
    },
    limit: {
      type: "integer",
      description: "The maximum number of results to return. Maximum of 20.",
      optional: true,
    },
    idBoard: {
      type: "string",
      optional: true,
    },
    idOrganization: {
      type: "string",
      optional: true,
    },
    onlyOrgMembers: {
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {
    const trelloParams = [
      "query",
      "limit",
      "idBoard",
      "idOrganization",
      "onlyOrgMembers",
    ];
    let p = this;

    const queryString = trelloParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    return await axios($, {
      url: `https://api.trello.com/1/search/members?${queryString}`,
      method: "GET",
    }, {
      token: {
        key: this.trello.$auth.oauth_access_token,
        secret: this.trello.$auth.oauth_refresh_token,
      },
      oauthSignerUri: this.trello.$auth.oauth_signer_uri,
    });
  },
};
