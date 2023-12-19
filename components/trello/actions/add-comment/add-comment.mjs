// legacy_hash_id: a_Xzi26w
import { axios } from "@pipedream/platform";

export default {
  key: "trello-add-comment",
  name: "Create a Comment",
  description: "Create a new comment on a specific card.",
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
    text: {
      type: "string",
      description: "The comment to add.",
    },
  },
  async run({ $ }) {
    const oauthSignerUri = this.trello.$auth.oauth_signer_uri;

    let id = this.id;
    const trelloParams = [
      "text",
    ];
    let p = this;

    const queryString = trelloParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    const config = {
      url: `https://api.trello.com/1/cards/${id}/actions/comments?${queryString}`,
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
