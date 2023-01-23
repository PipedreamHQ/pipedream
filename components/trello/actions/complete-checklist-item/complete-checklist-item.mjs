// legacy_hash_id: a_EViowW
import { axios } from "@pipedream/platform";

export default {
  key: "trello-complete-checklist-item",
  name: "Complete a Checklist Item",
  description: "Completes an existing checklist item in a card.",
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
    idCheckItem: {
      type: "string",
      description: "The ID of the checklist item to complete.",
    },
  },
  async run({ $ }) {
    const oauthSignerUri = this.trello.$auth.oauth_signer_uri;

    let id = this.id;
    let idCheckItem = this.idCheckItem;

    const config = {
      url: `https://api.trello.com/1/cards/${id}/checkItem/${idCheckItem}?state=complete`,
      method: "PUT",
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
