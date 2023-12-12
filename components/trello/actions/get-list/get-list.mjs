import { axios } from "@pipedream/platform";

export default {
  key: "trello-get-list",
  name: "Get List",
  description: "Get information about a List",
  version: "0.0.3",
  type: "action",
  props: {
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    trello: {
      type: "app",
      app: "trello",
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the Trello list",
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://api.trello.com/1/lists/${this.listId}`,
    }, {
      token: {
        key: this.trello.$auth.oauth_access_token,
        secret: this.trello.$auth.oauth_refresh_token,
      },
      oauthSignerUri: this.trello.$auth.oauth_signer_uri,
    });
  },
};
