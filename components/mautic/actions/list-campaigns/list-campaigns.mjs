// legacy_hash_id: a_xqiVgN
import { axios } from "@pipedream/platform";

export default {
  key: "mautic-list-campaigns",
  name: "List Campaigns",
  description: "Gets a list of campaigns.",
  version: "0.1.1",
  type: "action",
  props: {
    mautic: {
      type: "app",
      app: "mautic",
    },
    search: {
      type: "string",
      description: "String or search command to filter entities by.",
      optional: true,
    },
    start: {
      type: "integer",
      description: "Starting row for the entities returned. Defaults to 0.",
      optional: true,
    },
    limit: {
      type: "integer",
      description: "Limit number of entities to return. Defaults to the system configuration for pagination (30).",
      optional: true,
    },
    orderBy: {
      type: "string",
      description: "Column to sort by. Can use any column listed in the response.",
      optional: true,
    },
    orderByDir: {
      type: "string",
      description: "Sort direction: `asc` or `desc`.",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    published: {
      type: "boolean",
      description: "Only return currently published entities.",
      optional: true,
    },
    minimal: {
      type: "boolean",
      description: "Return only array of entities without additional lists in it.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.mautic.org/#list-campaigns

    return await axios($, {
      method: "get",
      url: `${this.mautic.$auth.mautic_url}/api/campaigns`,
      headers: {
        Authorization: `Bearer ${this.mautic.$auth.oauth_access_token}`,
      },
      params: {
        search: this.search,
        start: this.start,
        limit: this.limit,
        orderBy: this.orderBy,
        orderByDir: this.orderByDir,
        published: this.published,
        minimal: this.minimal,
      },
    });
  },
};
