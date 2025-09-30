// legacy_hash_id: a_vgi47v
import { axios } from "@pipedream/platform";

export default {
  key: "zoom-list-channels",
  name: "List Channels",
  description: "List a user's chat channels.",
  version: "0.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zoom: {
      type: "app",
      app: "zoom",
    },
    page_size: {
      type: "integer",
      description: "The number of records returned from a single API call.",
      optional: true,
    },
    next_page_token: {
      type: "string",
      description: "The next page token is used to paginate through large result sets. The expiration period for this token is 15 minutes.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs here: https://marketplace.zoom.us/docs/api-reference/zoom-api/chat-channels/getchannels

    const config = {
      method: "get",
      url: "https://api.zoom.us/v2/chat/users/me/channels",
      headers: {
        Authorization: `Bearer ${this.zoom.$auth.oauth_access_token}`,
      },
      params: {
        page_size: this.page_size,
        next_page_token: this.next_page_token,
      },
    };

    return await axios($, config);
  },
};
