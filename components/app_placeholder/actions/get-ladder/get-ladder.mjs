// legacy_hash_id: "a_k6iYqj"
import { axios } from "@pipedream/platform";

export default {
  key: "app_placeholder-get-ladder",
  name: "Get ladder",
  description: "Get a ladder by league id. There is a restriction in place on the last ladder entry you are able to retrieve which is set to 15000.",
  version: "0.1.1",
  type: "action",
  props: {
    id: {
      type: "string",
      description: "The id (name) of the league for the ladder you want to retrieve.",
    },
    realm: {
      type: "string",
      description: "The realm of the league for the ladder you want to retrieve: pc (default), xbox, or sony.",
      optional: true,
    },
    limit: {
      type: "string",
      description: "Specifies the number of ladder entries to include. Default: 20, Max: 200.",
      optional: true,
    },
    offset: {
      type: "string",
      description: "Specifies the offset to the first ladder entry to include. Default: 0.",
      optional: true,
    },
    type: {
      type: "string",
      description: "Specifies the type of ladder: league (default), pvp, labyrinth.",
      optional: true,
    },
    track: {
      type: "boolean",
      description: "Adds unique IDs for each character returned. These can be used when name conflicts occur. Default: true.",
      optional: true,
    },
    accountName: {
      type: "string",
      description: "League only: Filters by account name within the first 15000 results.",
      optional: true,
    },
    difficulty: {
      type: "string",
      description: "Labyrinth only: Standard (1), Cruel (2), or Merciless (3).",
      optional: true,
    },
    start: {
      type: "string",
      description: "Labyrinth only: Timestamp of the ladder you want.",
      optional: true,
    },
  },
  async run({ $ }) {
    const config = {
      url: `http://api.pathofexile.com/ladders/${this.id}`,
      params: {
        realm: this.realm || "pc",
        limit: this.limit || 20,
        offset: this.offset || 0,
        type: this.type || "league",
        track: this.track || true,
        accountName: this.accountName,
        difficulty: this.difficulty,
        start: this.start,
      },
    };
    return await axios($, config);
  },
};
