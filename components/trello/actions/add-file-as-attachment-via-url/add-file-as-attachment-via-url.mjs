// legacy_hash_id: a_elirYr
import { axios } from "@pipedream/platform";

export default {
  key: "trello-add-file-as-attachment-via-url",
  name: "Add Attachment to Card via URL",
  description: "Create a file attachment on a card by referencing a public URL",
  version: "0.1.2",
  type: "action",
  props: {
    trello: {
      type: "app",
      app: "trello",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the attachment. Max length 256.",
      optional: true,
    },
    mimeType: {
      type: "string",
      label: "MIME Type",
      description: "The mimeType of the attachment. Max length 256.",
      optional: true,
    },
    url: {
      type: "string",
      label: "File URL",
      description: "A URL to a file you'd like to attach. Must start with http:// or https://",
    },
    id: {
      type: "string",
      label: "ID",
      description: "The ID of your Trello card",
    },
  },
  async run({ $ }) {
    const oauthSignerUri = this.trello.$auth.oauth_signer_uri;

    const trelloParams = [
      "name",
      "mimeType",
      "url",
    ];
    let p = this;

    const queryString = trelloParams.filter((param) => p[param]).map((param) => `${param}=${encodeURIComponent(p[param])}`)
      .join("&");

    const config = {
      url: `https://api.trello.com/1/cards/${this.id}/attachments?${queryString}`,
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
