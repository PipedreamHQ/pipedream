// legacy_hash_id: a_xqi4E7
import { axios } from "@pipedream/platform";

export default {
  key: "trello-add-label-to-card",
  name: "Add Existing Label to Card",
  description: "Add an existing label to a card.",
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
    value: {
      type: "string",
      description: "The ID of the label to add",
    },
  },
  async run({ $ }) {
    const oauthSignerUri = this.trello.$auth.oauth_signer_uri;

    let id = this.id;
    const trelloParams = [
      "value",
    ];
    let p = this;

    const queryString = trelloParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    const config = {
      url: `https://api.trello.com/1/cards/${id}/idLabels?${queryString}`,
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
