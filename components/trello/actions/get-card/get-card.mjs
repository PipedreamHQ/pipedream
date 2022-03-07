// legacy_hash_id: a_74ijLO
import { axios } from "@pipedream/platform";

export default {
  key: "trello-get-card",
  name: "Trello Get Card",
  description: "Get a card by its ID",
  version: "0.1.3",
  type: "action",
  props: {
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    trello: {
      type: "app",
      app: "trello",
    },
    cardId: {
      type: "string",
      label: "Card ID",
      description: "The ID of the Trello card",
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://api.trello.com/1/cards/${this.cardId}`,
    }, {
      token: {
        key: this.trello.$auth.oauth_access_token,
        secret: this.trello.$auth.oauth_refresh_token,
      },
      oauthSignerUri: this.trello.$auth.oauth_signer_uri,
    });
  },
};
