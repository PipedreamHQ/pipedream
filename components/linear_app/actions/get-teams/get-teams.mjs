// legacy_hash_id: a_wdijzb
import { axios } from "@pipedream/platform";

export default {
  key: "linear_app-get-teams",
  name: "Get teams",
  description: "Get your team IDs",
  version: "0.1.1",
  type: "action",
  props: {
    linear_app: {
      type: "app",
      app: "linear_app",
    },
  },
  async run({ $ }) {
    const data = {
      "query": `{
    teams {
      nodes {
        id
        name
      }
    }
  }`,
    };

    return await axios($, {
      method: "post",
      url: "https://api.linear.app/graphql",
      headers: {
        "Authorization": `${this.linear_app.$auth.api_key}`,
      },
      data,
    });
  },
};
