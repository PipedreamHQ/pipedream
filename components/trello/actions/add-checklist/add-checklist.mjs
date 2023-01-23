// legacy_hash_id: a_WYieM3
import { axios } from "@pipedream/platform";

export default {
  key: "trello-add-checklist",
  name: "Create a Checklist",
  description: "Adds a new checklist to a card.",
  version: "0.1.2",
  type: "action",
  props: {
    trello: {
      type: "app",
      app: "trello",
    },
    id: {
      type: "string",
      description: "The ID of the card.",
    },
    name: {
      type: "string",
      description: "The name of the checklist.",
      optional: true,
    },
    idChecklistSource: {
      type: "string",
      description: "The ID of a source checklist to copy into the new one.",
      optional: true,
    },
    pos: {
      type: "string",
      description: "The position of the checklist on the card. One of: top, bottom, or a positive number.",
      optional: true,
    },
  },
  async run({ $ }) {
    const oauthSignerUri = this.trello.$auth.oauth_signer_uri;

    let id = this.id;
    const trelloParams = [
      "name",
      "idChecklistSource",
      "pos",
    ];
    let p = this;

    const queryString = trelloParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    const config = {
      url: `https://api.trello.com/1/cards/${id}/checklists?${queryString}`,
      method: "POST",
      data: "",
    };

    const token = {
      key: this.trello.$auth.oauth_access_token,
      secret: this.trello.$auth.oauth_refresh_token,
    };

    const signConfig = {
      token,
      oauthSignerUri,
    };

    const resp = await axios($, config, signConfig);
    return resp;
  },
};
