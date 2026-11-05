import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-find-testimonial-requests",
  name: "Find Testimonial Requests",
  description: "Lists the testimonial requests of a site, or finds one by name or subject, with its status. Use it to get the request ID for **Ask for Testimonial**. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
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
    q: {
      type: "string",
      label: "Search",
      description: "Words in the name or the subject of the request, e.g. `Q4 customers`.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "One of draft, scheduled, sending, waiting, stopped, finished.",
      options: [
        "draft",
        "scheduled",
        "sending",
        "waiting",
        "stopped",
        "finished",
      ],
      optional: true,
    },
    formId: {
      propDefinition: [
        app,
        "testimonialFormId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
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
      path: `/sites/${utils.segment(this.siteId)}/testimonials/requests.json`,
      params: utils.compact({
        q: this.q,
        status: this.status,
        form_id: this.formId,
      }),
      maxResults: this.maxResults,
    });
    $.export("$summary", `Found ${items.length} testimonial request${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
