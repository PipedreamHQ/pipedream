// legacy_hash_id: a_gniNJJ
import { axios } from "@pipedream/platform";

export default {
  key: "trello-find-labels",
  name: "Find a Label",
  description: "Finds a label on a specific board by name.",
  version: "0.1.1",
  type: "action",
  props: {
    trello: {
      type: "app",
      app: "trello",
    },
    id: {
      type: "string",
      description: "The ID of the board.",
    },
    query: {
      type: "string",
      description: "The query to search for.",
    },
    fields: {
      type: "string",
      description: "all or a comma-separated list of label fields (id, idBoard, name, color).",
      optional: true,
    },
    limit: {
      type: "integer",
      description: "0 to 1000",
      optional: true,
    },
  },
  async run({ $ }) {
    let id = this.id;
    let query = this.query;
    const trelloParams = [
      "fields",
      "limit",
    ];
    let p = this;
    let labels = null;
    let matches = [];

    const queryString = trelloParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    labels = await axios($, {
      url: `https://api.trello.com/1/boards/${id}/labels?${queryString}`,
      method: "GET",
    }, {
      token: {
        key: this.trello.$auth.oauth_access_token,
        secret: this.trello.$auth.oauth_refresh_token,
      },
      oauthSignerUri: this.trello.$auth.oauth_signer_uri,
    });
    if (labels) {
      labels.forEach(function(label) {
        if (label.name.includes(query))
          matches.push(label);
      });
    }

    return matches;
  },
};
