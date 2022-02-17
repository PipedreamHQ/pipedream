// legacy_hash_id: a_njiaR8
import { axios } from "@pipedream/platform";

export default {
  key: "trello-archive-card",
  name: "Archive Card",
  description: "Archives the specified card.",
  version: "0.1.1",
  type: "action",
  props: {
    trello: {
      type: "app",
      app: "trello",
    },
    id: {
      type: "string",
      description: "The ID of the card to archive.",
    },
  },
  async run({ $ }) {
    const oauthSignerUri = this.trello.$auth.oauth_signer_uri;

    let id = this.id;

    const config = {
      url: `https://api.trello.com/1/cards/${id}?closed=true`,
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
