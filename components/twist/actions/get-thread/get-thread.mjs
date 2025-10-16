// legacy_hash_id: a_Q3iRXl
import { axios } from "@pipedream/platform";

export default {
  key: "twist-get-thread",
  name: "Get Thread",
  description: "Gets a thread object by id.",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    twist: {
      type: "app",
      app: "twist",
    },
    thread_id: {
      type: "string",
      description: "The id of the thread to get details of.",
    },
  },
  async run({ $ }) {
  //See the API docs: https://api.twistapp.com/v3/#get-thread

    if (!this.thread_id) {
      throw new Error("Must provide thread_id parameter.");
    }

    return await axios($, {
      url: "https://api.twist.com/api/v3/threads/getone",
      headers: {
        Authorization: `Bearer ${this.twist.$auth.oauth_access_token}`,
      },
      params: {
        id: this.thread_id,
      },

    });
  },
};
