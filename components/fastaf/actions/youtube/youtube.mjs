import fastaf from "../../fastaf.app.mjs";

export default {
  key: "fastaf-youtube",
  name: "Get YouTube Data",
  description: "Retrieve a video transcript for 1 credit or a search page for 5 credits. [Documentation](https://fastaf.co/docs/#youtube)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fastaf,
    resource: {
      type: "string",
      label: "Resource",
      description: "Choose transcript (default) or search. [Documentation](https://fastaf.co/docs/#youtube)",
      options: [
        "transcript",
        "search",
      ],
      default: "transcript",
    },
    videoId: {
      type: "string",
      label: "Video ID",
      description: "Video identifier after `v=` in a watch URL, not the full URL. Required for transcript; ignored for search. [Documentation](https://fastaf.co/docs/#youtube)",
      optional: true,
    },
    query: {
      propDefinition: [
        fastaf,
        "query",
      ],
      optional: true,
      description: "Required for search; ignored for transcript. [Documentation](https://fastaf.co/docs/#youtube)",
    },
    searchToken: {
      type: "string",
      label: "Search Filter or Page Token",
      description: "YouTube `sp` filter or continuation token from a prior response. Search only; omitted for the first unfiltered page. Each page costs 5 credits. [Documentation](https://fastaf.co/docs/#youtube)",
      optional: true,
    },
    country: {
      propDefinition: [
        fastaf,
        "country",
      ],
    },
    language: {
      propDefinition: [
        fastaf,
        "language",
      ],
    },
  },
  async run({ $ }) {
    const resource = this.resource || "transcript";
    if (resource === "transcript" && !this.videoId?.trim()) throw new Error("Transcript requires a video ID.");
    if (resource === "search" && !this.query?.trim()) throw new Error("Search requires a query.");
    const { data } = await this.fastaf.youtube({
      $,
      data: {
        resource,
        v: resource === "transcript"
          ? this.videoId
          : undefined,
        search_query: resource === "search"
          ? this.query
          : undefined,
        sp: resource === "search"
          ? this.searchToken
          : undefined,
        country: this.country,
        language: this.language,
      },
    });
    $.export("$summary", "Successfully retrieved the requested YouTube resource.");
    return data;
  },
};
