import serphouse from "../../serphouse.app.mjs";

export default {
  key: "serphouse-google-jobs-search",
  name: "Google Jobs Search",
  description: "Performs a Google Jobs search using the Serphouse API. [See the documentation](https://docs.serphouse.com/google-apis/google-jobs-api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    serphouse,
    query: {
      propDefinition: [
        serphouse,
        "query",
      ],
    },
    domain: {
      propDefinition: [
        serphouse,
        "domain",
        () => ({
          type: "google",
        }),
      ],
    },
    language: {
      propDefinition: [
        serphouse,
        "language",
        ({ domain }) => ({
          domain,
        }),
      ],
    },
    locationAlert: {
      propDefinition: [
        serphouse,
        "locationAlert",
      ],
    },
    locationId: {
      propDefinition: [
        serphouse,
        "locationId",
        ({ domain }) => ({
          domain,
        }),
      ],
    },
    dateRange: {
      propDefinition: [
        serphouse,
        "dateRange",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.serphouse.googleJobsSearch({
      $,
      data: {
        data: {
          q: this.query,
          domain: this.domain,
          lang: this.language,
          loc_id: this.locationId,
          date_range: this.dateRange,
        },
      },
    });
    if (response.status === "success") {
      $.export("$summary", `Successfully performed Google Jobs search for "${this.query}".`);
    }
    return response;
  },
};
