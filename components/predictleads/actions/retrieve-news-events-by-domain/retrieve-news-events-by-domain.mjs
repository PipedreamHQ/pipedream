import app from "../../predictleads.app.mjs";

export default {
  key: "predictleads-retrieve-news-events-by-domain",
  name: "Retrieve News Events By Domain",
  description: "Retrieve news events for a company by domain. [See the documentation](https://docs.predictleads.com/v3/api_endpoints/news_events_dataset/retrieve_company_s_news_events)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    domain: {
      description: "The domain of the company to retrieve news events for (e.g., `google.com`).",
      propDefinition: [
        app,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      domain,
    } = this;
    const response = await app.retrieveNewsEvents({
      $,
      domain,
    });
    $.export("$summary", "Successfully retrieved the first page of news events.");
    return response;
  },
};
