// legacy_hash_id: "a_B0izap"
import { axios } from "@pipedream/platform";

export default {
  key: "app_placeholder-get-public-stash-tabs",
  name: "Get public stash tabs",
  description: "Retrieves a list of stashes, accounts, and items as described above in the Introduction section.",
  version: "0.1.1",
  type: "action",
  props: {
    id: {
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const config = {
      url: "http://api.pathofexile.com/public-stash-tabs/",
      params: {
        id: this.id,
      },
    };
    return await axios($, config);
  },
};
