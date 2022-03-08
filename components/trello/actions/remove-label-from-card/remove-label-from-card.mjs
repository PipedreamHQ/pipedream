// legacy_hash_id: a_k6iY7Q
import { axios } from "@pipedream/platform";

export default {
  key: "trello-remove-label-from-card",
  name: "Remove Label From Card",
  description: "Removes an existing label from a card.",
  version: "0.1.1",
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
    idLabel: {
      type: "string",
      description: "The ID of the label to remove.",
    },
  },
  async run({ $ }) {
    const oauthSignerUri = this.trello.$auth.oauth_signer_uri;

    let id = this.id;
    let idLabel = this.idLabel;

    const config = {
      url: `https://api.trello.com/1/cards/${id}/idLabels/${idLabel}`,
      method: "DELETE",
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
