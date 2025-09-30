import app from "../../leadzen_ai.app.mjs";

export default {
  key: "leadzen_ai-simple-search",
  name: "Simple Search",
  description: "Fetches detailed LinkedIn profile information based on the provided URL. [See the documentation](https://api.leadzen.ai/docs#/People/people_search_detailed_api_people_linkedin_url_profile_post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    detailsUrl: {
      propDefinition: [
        app,
        "url",
      ],
    },
  },
  methods: {
    simpleSearch(args = {}) {
      return this.app.post({
        path: "/people/linkedin_url/profile",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      simpleSearch,
      detailsUrl,
    } = this;

    const { id: searchId } = await simpleSearch({
      $,
      data: {
        details_url: detailsUrl,
      },
    });

    const response = await app.retry({
      $,
      fn: app.getDetailedProfile,
      delay: 5000,
      searchId,
    });

    if (response?.status === "failed") {
      $.export("$summary", "Failed to performed simple search");
      return response;
    }

    $.export("$summary", `Successfully performed simple search with ID \`${response?.search_result?.id}\`.`);
    return response;
  },
};
