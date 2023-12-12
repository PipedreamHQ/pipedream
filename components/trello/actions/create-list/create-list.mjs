// legacy_hash_id: a_G1iBG7
import { axios } from "@pipedream/platform";

export default {
  key: "trello-create-list",
  name: "Create a List",
  description: "Creates a new list on a board",
  version: "0.1.2",
  type: "action",
  props: {
    trello: {
      type: "app",
      app: "trello",
    },
    name: {
      type: "string",
      description: "Name for the list.",
    },
    idBoard: {
      type: "string",
      description: "The long ID of the board the list should be created on.",
    },
    idListSource: {
      type: "string",
      description: "ID of the list to copy into the new list.",
      optional: true,
    },
    pos: {
      type: "string",
      description: "Position of the list. top, bottom, or a positive floating point number.",
      optional: true,
    },
  },
  async run({ $ }) {
    const oauthSignerUri = this.trello.$auth.oauth_signer_uri;

    const trelloParams = [
      "name",
      "idBoard",
      "idListSource",
      "pos",
    ];
    let p = this;

    const queryString = trelloParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    const config = {
      url: `https://api.trello.com/1/lists?${queryString}`,
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
