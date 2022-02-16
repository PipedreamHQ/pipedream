// legacy_hash_id: a_YEiwAL
import { axios } from "@pipedream/platform";

export default {
  key: "bubble-bubble",
  name: "Bubble",
  version: "0.1.1",
  type: "action",
  props: {
    bubble: {
      type: "app",
      app: "bubble",
    },
  },
  async run({ $ }) {
  // Since every Bubble API is specific to its associated app, you'll
  // need to modify the code below to work with your API. This code
  // is meant to provide the scaffolding you need to get started.
    return await axios($, {
      url: `${this.bubble.$auth.root_url}`,
      headers: {
        Authorization: `Bearer ${this.bubble.$auth.api_key}`,
      },
    });
  },
};
