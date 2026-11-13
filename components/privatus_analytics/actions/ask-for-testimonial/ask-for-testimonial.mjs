import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-ask-for-testimonial",
  name: "Ask for Testimonial",
  description: "Adds a person to a testimonial request. In a running request they get the first email at once, in a draft they wait for it to be sent. Request emails need the Business plan and a connected email provider. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
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
    requestId: {
      propDefinition: [
        app,
        "testimonialRequestId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The address the request email goes to.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Used in the email greeting and to fill in the form.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the person.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Job Title",
      description: "The job title of the person.",
      optional: true,
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "Custom property values for the testimonial, by key, as set up in the testimonial settings of the site.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/sites/${utils.segment(this.siteId)}/testimonials/requests/${utils.segment(this.requestId)}/recipients.json`,
      data: utils.compact({
        recipients: [
          utils.compact({
            email: this.email,
            name: this.name,
            company: this.company,
            title: this.title,
            properties: utils.blank(this.properties) || !Object.keys(this.properties).length
              ? undefined
              : this.properties,
          }),
        ],
      }),
    });
    $.export("$summary", response.added
      ? `Successfully added ${this.email} to the request`
      : `${this.email} was skipped`);
    return response;
  },
};
