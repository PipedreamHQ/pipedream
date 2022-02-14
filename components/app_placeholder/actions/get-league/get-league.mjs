// legacy_hash_id: "a_8KiVQV"
import { axios } from "@pipedream/platform";

export default {
  key: "app_placeholder-get-league",
  name: "Get league",
  description: "Get a single league by id",
  version: "0.1.1",
  type: "action",
  props: {
    id: {
      type: "string",
      description: "The id (name) of the league.",
    },
    realm: {
      type: "string",
      description: "The realm of the league: pc (default), xbox, or sony.",
      optional: true,
    },
    ladder: {
      type: "string",
      description: "Set to 1 to include the ladder in the response. The ladder will be in included in the \"ladder\" key. Defaults to 0, excluding the ladder. Please note that the ladder can be retrieved using the ladder resource, and that retrieving it using the league API is just an optimization that can be used if you are requesting the league anyway.",
      optional: true,
    },
    ladderLimit: {
      type: "string",
      description: "When including the ladder with ladder=1, this specifies the number of ladder entries to include. Default: 20, Max: 200.",
      optional: true,
    },
    ladderOffset: {
      type: "string",
      description: "When including the ladder with ladder=1, this specifies the offset to the first ladder entry to include. Default: 0.",
      optional: true,
    },
    ladderTrack: {
      type: "string",
      description: "When including the ladder with ladder=1, this setting adds unique IDs for each character returned. These can be used when name conflicts occur.",
      optional: true,
    },
  },
  async run({ $ }) {
    const config = {
      url: `http://api.pathofexile.com/league/${this.id}`,
      params: {
        realm: this.realm || "pc",
        ladder: this.ladder || "0",
        ladderLimit: this.ladderLimit || 20,
        ladderOffset: this.ladderOffset || 0,
        ladderTrack: this.ladderTrack,
      },
    };
    return await axios($, config);
  },
};
