import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-get-opportunity",
  name: "Get Opportunity",
  description:
    "Returns full details for a single opportunity (candidate application) by ID."
    + " Use this after **Search Opportunities** when you need complete candidate data including contact info, stage, notes, and application history."
    + " Set expand to inline related objects: `applications` for application records, `stage` for the current stage name, `owner` for the assigned recruiter, `contact` for full contact details."
    + " The opportunity ID comes from search results or from a webhook payload."
    + " [See the documentation](https://hire.lever.co/developer/documentation#retrieve-a-single-opportunity)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    opportunityId: {
      propDefinition: [
        app,
        "opportunityId",
      ],
      description: "The ID of the opportunity to retrieve. Use **Search Opportunities** to find opportunity IDs.",
    },
    expand: {
      propDefinition: [
        app,
        "expand",
      ],
      description: "Inline related objects in the response. Options: `applications`, `stage`, `owner`, `followers`, `sourcedBy`, `contact`, `offers`.",
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.expand?.length) params.expand = this.expand.join(",");

    const response = await this.app.getOpportunity(this.opportunityId, {
      $,
      params,
    });
    const opportunity = response.data ?? response;
    const name = opportunity.name ?? opportunity.id;
    $.export("$summary", `Retrieved opportunity for ${name}`);
    return opportunity;
  },
};
