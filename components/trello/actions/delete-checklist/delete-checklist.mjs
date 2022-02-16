// legacy_hash_id: a_RAiav3
import { axios } from "@pipedream/platform";

export default {
  key: "trello-delete-checklist",
  name: "Delete a Checklist",
  description: "Deletes an existing checklist on a card.",
  version: "0.1.1",
  type: "action",
  props: {
    trello: {
      type: "app",
      app: "trello",
    },
    id: {
      type: "string",
      description: "ID of the checklist to delete.",
    },
  },
  async run({ $ }) {
    const oauthSignerUri = this.trello.$auth.oauth_signer_uri;

    let id = this.id;

    const config = {
      url: `https://api.trello.com/1/checklists/${id}`,
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
