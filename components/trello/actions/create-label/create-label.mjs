// legacy_hash_id: a_l0iLRL
import { axios } from "@pipedream/platform";

export default {
  key: "trello-create-label",
  name: "Create Label",
  description: "Creates a new label on the specified board.",
  version: "0.1.2",
  type: "action",
  props: {
    trello: {
      type: "app",
      app: "trello",
    },
    name: {
      type: "string",
      description: "Name for the label.",
    },
    color: {
      type: "string",
      description: "The color for the label. One of: yellow, purple, blue, red, green, orange, black, sky, pink, lime, null (null means no color, and the label will not show on the front of cards)",
      options: [
        "yellow",
        "purple",
        "blue",
        "red",
        "green",
        "orange",
        "black",
        "sky",
        "pink",
        "lime",
        "null",
      ],
    },
    idBoard: {
      type: "string",
      description: "The ID of the board to create the label on.",
    },
  },
  async run({ $ }) {
    const oauthSignerUri = this.trello.$auth.oauth_signer_uri;

    const trelloParams = [
      "name",
      "color",
      "idBoard",
    ];
    let p = this;

    const queryString = trelloParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    const config = {
      url: `https://api.trello.com/1/labels?${queryString}`,
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
