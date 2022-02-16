// legacy_hash_id: a_m8iXqE
import { axios } from "@pipedream/platform";

export default {
  key: "trello-find-list",
  name: "Find a List",
  description: "Finds a list on a specific board by name.",
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
    cards: {
      type: "string",
      description: "One of: all, closed, none, open.",
      optional: true,
      options: [
        "all",
        "closed",
        "none",
        "open",
      ],
    },
    card_fields: {
      type: "string",
      label: "Card Fields",
      description: "all or a comma-separated list of card fields (id, badges, checkItemStates, closed, dateLastActivity, desc, descData, due, dueComplete, idAttachmentCover, idBoard, idChecklists, idLabels, idList, idMembers, idMembersVoted, idShort, labels, manualCoverAttachment, name, pos, shortlink, shortUrl, subscribed, url, address, locationName, coordinates).",
      optional: true,
    },
    filter: {
      type: "string",
      description: "One of all, closed, none, open.",
      optional: true,
      options: [
        "all",
        "closed",
        "none",
        "open",
      ],
    },
    fields: {
      type: "string",
      description: "all or a comma-separated list of list fields (id, name, closed, idBoard, pos, subscribed, softLimit).",
      optional: true,
    },
  },
  async run({ $ }) {
    let id = this.id;
    let query = this.query;
    const trelloParams = [
      "cards",
      "card_fields",
      "filter",
      "fields",
    ];
    let p = this;
    let lists = null;
    let matches = [];

    const queryString = trelloParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    lists = await axios($, {
      url: `https://api.trello.com/1/boards/${id}/lists?${queryString}`,
      method: "GET",
    }, {
      token: {
        key: this.trello.$auth.oauth_access_token,
        secret: this.trello.$auth.oauth_refresh_token,
      },
      oauthSignerUri: this.trello.$auth.oauth_signer_uri,
    });
    if (lists) {
      lists.forEach(function(list) {
        if (list.name.includes(query))
          matches.push(list);
      });
    }

    return matches;
  },
};
