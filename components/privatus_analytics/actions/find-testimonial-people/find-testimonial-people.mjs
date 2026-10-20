import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-find-testimonial-people",
  name: "Find Testimonial People",
  description: "Finds the people of a site who give testimonials, by email or name. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": false,
    "readOnlyHint": true,
  },
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
    query: {
      type: "string",
      label: "Email or Name",
      description: "Part of a name or a company. For a caller with content.write, also part of an email address.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "A company name or website host. Only its people are listed.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    let items = await this.app.paginate({
      $,
      path: `/sites/${utils.segment(this.siteId)}/testimonials/people.json`,
      params: utils.compact({
        query: this.query,
        company: this.company,
      }),
      maxResults: this.maxResults,
    });
    $.export("$summary", `Found ${items.length} ${items.length === 1
      ? "person"
      : "people"}`);
    return items;
  },
};
