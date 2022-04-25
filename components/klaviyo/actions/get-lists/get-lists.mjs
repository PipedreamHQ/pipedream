// legacy_hash_id: a_2wimkG
import { axios } from "@pipedream/platform";

export default {
  key: "klaviyo-get-lists",
  name: "Get Lists",
  description: "Get a listing of all of the lists in an account.",
  version: "0.1.1",
  type: "action",
  props: {
    klaviyo: {
      type: "app",
      app: "klaviyo",
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: "https://a.klaviyo.com/api/v2/lists",
      params: {
        api_key: `${this.klaviyo.$auth.api_key}`,
      },
    });
  },
};
