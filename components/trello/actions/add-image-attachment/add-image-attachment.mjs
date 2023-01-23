// legacy_hash_id: a_B0im8k
import { axios } from "@pipedream/platform";

export default {
  key: "trello-add-image-attachment",
  name: "Add Image Attachment to Card",
  description: "Adds image to card",
  version: "0.1.3",
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
      description: "The name of the attachment. Max length 256.",
      optional: true,
    },
    file: {
      type: "string",
      description: "The file to attach, as multipart/form-data",
      optional: true,
    },
    mimeType: {
      type: "string",
      description: "The mimeType of the attachment. Max length 256.",
      optional: true,
    },
    url: {
      type: "string",
      description: "A URL to attach. Must start with http:// or https://",
    },
  },
  async run({ $ }) {
    const oauthSignerUri = this.trello.$auth.oauth_signer_uri;

    let id = this.id;
    const trelloParams = [
      "name",
      "file",
      "mimeType",
      "url",
    ];
    let p = this;

    const queryString = trelloParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    const config = {
      url: `https://api.trello.com/1/cards/${id}/attachments?${queryString}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
