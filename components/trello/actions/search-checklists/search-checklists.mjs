// legacy_hash_id: a_1WiqM5
import { axios } from "@pipedream/platform";

export default {
  key: "trello-search-checklists",
  name: "Find Checklist",
  description: "Find a checklist on a particular board or card by name.",
  version: "0.1.2",
  type: "action",
  props: {
    trello: {
      type: "app",
      app: "trello",
    },
    type: {
      type: "string",
      description: "Whether to search boards or cards for the checklist.",
      options: [
        "board",
        "card",
      ],
    },
    id: {
      type: "string",
      description: "The ID of the board or card.",
    },
    query: {
      type: "string",
      description: "The query to search for.",
    },
    checkItems: {
      type: "string",
      description: "all or none",
      optional: true,
      options: [
        "all",
        "none",
      ],
    },
    checkItem_fields: {
      type: "string",
      label: "CheckItem Fields",
      description: "all or a comma-separated list of: name, nameData, pos, state, type",
      optional: true,
    },
    filter: {
      type: "string",
      description: "all or none",
      optional: true,
      options: [
        "all",
        "none",
      ],
    },
    fields: {
      type: "string",
      description: "all or a comma-separated list of: idBoard, idCard, name, pos",
      optional: true,
    },
  },
  async run({ $ }) {
    let type = this.type;
    let id = this.id;
    let query = this.query;
    const trelloParams = [
      "checkItems",
      "checkItem_fields",
      "filter",
      "fields",
    ];
    let p = this;
    let checklists = null;
    let matches = [];

    const queryString = trelloParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    if (type == "board") {
      checklists = await axios($, {
        url: `https://api.trello.com/1/boards/${id}/checklists?${queryString}`,
        method: "GET",
      }, {
        token: {
          key: this.trello.$auth.oauth_access_token,
          secret: this.trello.$auth.oauth_refresh_token,
        },
        oauthSignerUri: this.trello.$auth.oauth_signer_uri,
      });
    } else if (type == "card") {
      checklists = await axios($, {
        url: `https://api.trello.com/1/cards/${id}/checklists?${queryString}`,
        method: "GET",
      }, {
        token: {
          key: this.trello.$auth.oauth_access_token,
          secret: this.trello.$auth.oauth_refresh_token,
        },
        oauthSignerUri: this.trello.$auth.oauth_signer_uri,
      });
    }
    if (checklists) {
      checklists.forEach(function(checklist) {
        if (checklist.name.includes(query))
          matches.push(checklist);
      });
    }

    return matches;
  },
};
