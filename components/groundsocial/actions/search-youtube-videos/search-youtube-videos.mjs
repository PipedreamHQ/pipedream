import app from "../../groundsocial.app.mjs";

export default {
  key: "groundsocial-search-youtube-videos",
  name: "Search YouTube Videos",
  description: "Search YouTube videos. Each result's ID is in `items[].id.videoId`. [See the documentation](https://groundsocial.dev/docs/api/youtube-search-videos)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "Search words, e.g. `pipedream tutorial`",
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Result order, e.g. `relevance`",
      options: [
        "relevance",
        "popular",
        "date",
        "rating",
      ],
      default: "relevance",
      optional: true,
    },
    uploadDate: {
      type: "string",
      label: "Upload Date",
      description: "Only videos uploaded in this window, e.g. `month`",
      options: [
        "hour",
        "today",
        "week",
        "month",
        "year",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.callEndpoint({
      $,
      endpointId: "youtube.search.videos",
      params: {
        q: this.query,
        type: "video",
        sort: this.sort,
        upload_date: this.uploadDate,
      },
    });
    const count = response.items?.length ?? 0;
    $.export("$summary", `Found ${count} video${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
