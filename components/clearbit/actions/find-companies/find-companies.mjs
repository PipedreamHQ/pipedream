// legacy_hash_id: a_G1ieWm
import { axios } from "@pipedream/platform";

export default {
  key: "clearbit-find-companies",
  name: "Find Companies",
  description: "Find companies via specific criteria.",
  version: "0.2.1",
  type: "action",
  props: {
    clearbit: {
      type: "app",
      app: "clearbit",
    },
    query: {
      type: "string",
      description: "Search query string.",
    },
    page: {
      type: "string",
      description: "Which results page to show.",
      optional: true,
    },
    page_size: {
      type: "integer",
      description: "The amount of results to return per page.",
      optional: true,
    },
    limit: {
      type: "integer",
      description: "How many paginated results to return in total.",
      optional: true,
    },
    sort: {
      type: "string",
      description: "By default search, results are sorted by the best match available. You can change this to a specific sort.",
      optional: true,
      options: [
        "score_asc",
        "score_desc",
        "alexa_rank_asc",
        "alexa_rank_desc",
        "employees_asc",
        "employees_desc",
        "market_cap_asc",
        "market_cap_desc",
        "raised_asc",
        "raised_desc",
        "twitter_followers_desc",
        "twitter_followers_asc",
      ],
    },
  },
  async run({ $ }) {
  //See the API docs here: https://clearbit.com/docs#discovery-api-request
    return await axios($, {
      url: `https://discovery.clearbit.com/v1/companies/search?query=${this.query}&page=${this.page}&page_size=${this.page_size}&limit=${this.limit}&sort=${this.sort}`,
      headers: {
        Authorization: `Bearer ${this.clearbit.$auth.api_key}`,
      },
    });
  },
};
