// legacy_hash_id: a_jQiB5z
import { axios } from "@pipedream/platform";

export default {
  key: "trello-search-boards",
  name: "Search Boards",
  description: "Search for a Trello Board",
  version: "0.2.1",
  type: "action",
  props: {
    trello: {
      type: "app",
      app: "trello",
    },
    query: {
      type: "string",
      description: "The search query with a length of 1 to 16384 characters",
    },
    idBoards: {
      type: "string",
      description: "mine or a comma-separated list of board ids",
      optional: true,
    },
    idOrganizations: {
      type: "string",
      description: "A comma-separated list of team ids",
      optional: true,
    },
    board_fields: {
      type: "string",
      label: "Board Fields",
      description: "all or a comma-separated list of: closed, dateLastActivity, dateLastView, desc, descData, idOrganization, invitations, invited, labelNames, memberships, name, pinned, powerUps, prefs, shortLink, shortUrl, starred, subscribed, url",
      optional: true,
    },
    boards_limit: {
      type: "integer",
      label: "Boards Limit",
      description: "The maximum number of boards returned. Maximum: 1000",
      optional: true,
    },
    partial: {
      type: "string",
      description: "By default, Trello searches for each word in your query against exactly matching words within Member content. Specifying partial to be true means that we will look for content that starts with any of the words in your query. If you are looking for a Card titled \"My Development Status Report\", by default you would need to search for \"Development\". If you have partial enabled, you will be able to search for \"dev\" but not \"velopment\".",
      optional: true,
    },
  },
  async run({ $ }) {
    const trelloParams = [
      "query",
      "idBoards",
      "idOrganizations",
      "board_fields",
      "boards_limit",
      "partial",
    ];
    let p = this;

    const queryString = trelloParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    return await axios($, {
      url: `https://api.trello.com/1/search?modelTypes=boards&${queryString}`,
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
