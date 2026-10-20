import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-create-testimonial-person",
  name: "Create Testimonial Person",
  description: "Adds a person (a customer who gives testimonials) to a site. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": false,
    "readOnlyHint": false,
  },
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The person's name, up to 120 characters.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Their email address. Never shown publicly. One person per address on a site.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Job Title",
      description: "Their job title.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Where they work.",
      optional: true,
    },
    companyUrl: {
      type: "string",
      label: "Company URL",
      description: "The company's website (http or https). It groups people into companies.",
      optional: true,
    },
    socialUrl: {
      type: "string",
      label: "Social URL",
      description: "A link to their profile (http or https).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/sites/${utils.segment(this.siteId)}/testimonials/people.json`,
      data: utils.compact({
        name: this.name,
        email: this.email,
        title: this.title,
        company: this.company,
        company_url: this.companyUrl,
        social_url: this.socialUrl,
      }),
    });
    $.export("$summary", `Successfully created person '${response.name}'`);
    return response;
  },
};
