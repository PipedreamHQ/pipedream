import utils from "../../common/utils.mjs";
import app from "../../invidious.app.mjs";

export default {
  key: "invidious-search",
  name: "Search Videos",
  description: "Search for videos on Invidious. [See the documentation](https://docs.invidious.io/api/#get-apiv1search)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "query",
      ],
    },
    sort: {
      type: "string",
      label: "Sort By",
      description: "The criteria to sort the search results by.",
      optional: true,
      options: [
        "relevance",
        "rating",
        "date",
        "views",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date to filter the search results by.",
      optional: true,
      options: [
        "hour",
        "today",
        "week",
        "month",
        "year",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of videos to search for. Default: `all`",
      optional: true,
      options: [
        "video",
        "playlist",
        "channel",
        "movie",
        "show",
        "all",
      ],
    },
    features: {
      type: "string[]",
      label: "Features",
      description: "The features to filter the search results by. (comma separated: e.g. `hd,subtitles,3d,live`",
      optional: true,
      options: [
        "hd",
        "subtitles",
        "creative_commons",
        "3d",
        "live",
        "purchased",
        "4k",
        "360",
        "location",
        "hdr",
        "vr180",
      ],
    },
    region: {
      type: "string",
      label: "Search Region",
      description: "ISO 3166 country code (default: `US`)",
      optional: true,
    },
  },
  methods: {
    searchVideos(args = {}) {
      return this.app._makeRequest({
        path: "/search",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      searchVideos,
      q,
      sort,
      date,
      type,
      features,
      region,
    } = this;

    const response = await searchVideos({
      $,
      params: {
        q,
        sort,
        date,
        type,
        features: features && utils.arrayToCommaSeparatedList(features),
        region,
      },
    });

    $.export("$summary", `Successfully fetched \`${response?.length}\` search results.`);
    return response;
  },
};
