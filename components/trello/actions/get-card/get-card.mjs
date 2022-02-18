// legacy_hash_id: a_74ijLO
import { axios } from "@pipedream/platform";

export default {
  key: "trello-get-card",
  name: "Trello Get Card",
  description: "Get all parameters of a Card passing Card ID",
  version: "0.1.1",
  type: "action",
  props: {
    trello: {
      type: "app",
      app: "trello",
    },
  },
  async run({
    steps, $,
  }) {
    return await axios($, {

      url: "https://api.trello.com/1/cards/" + steps.nodejs.$return_value,
    }, {
      token: {
        key: this.trello.$auth.oauth_access_token,
        secret: this.trello.$auth.oauth_refresh_token,
      },
      oauthSignerUri: this.trello.$auth.oauth_signer_uri,
    });
  },
};
