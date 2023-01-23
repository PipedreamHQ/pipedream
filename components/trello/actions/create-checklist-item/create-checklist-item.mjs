// legacy_hash_id: a_bKiP4j
import { axios } from "@pipedream/platform";

export default {
  key: "trello-create-checklist-item",
  name: "Create a Checklist Item",
  description: "Creates a new checklist item in a card.",
  version: "0.1.2",
  type: "action",
  props: {
    trello: {
      type: "app",
      app: "trello",
    },
    id: {
      type: "string",
      description: "ID of a checklist.",
    },
    name: {
      type: "string",
      description: "The name of the new check item on the checklist. Should be a string of length 1 to 16384.",
    },
    pos: {
      type: "string",
      description: "The position of the check item in the checklist. One of: top, bottom, or a positive number.",
      optional: true,
    },
    checked: {
      type: "boolean",
      description: "Determines whether the check item is already checked when created.",
      optional: true,
    },
  },
  async run({ $ }) {
    const oauthSignerUri = this.trello.$auth.oauth_signer_uri;

    let id = this.id;
    const trelloParams = [
      "name",
      "pos",
      "checked",
    ];
    let p = this;

    const queryString = trelloParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    const config = {
      url: `https://api.trello.com/1/checklists/${id}/checkItems?${queryString}`,
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
