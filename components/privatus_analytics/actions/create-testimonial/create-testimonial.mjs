import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-create-testimonial",
  name: "Create Testimonial",
  description: "Adds a text testimonial, for example from a review, a support chat or a survey reply. It counts toward the monthly testimonials of the plan. [See the documentation](https://privatusanalytics.com/docs/api)",
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
    body: {
      type: "string",
      label: "Text",
      description: "The words, up to 10,000 characters.",
    },
    personName: {
      type: "string",
      label: "Person Name",
      description: "Who gave it.",
    },
    personEmail: {
      type: "string",
      label: "Person Email",
      description: "Their email. Never public. An address already on the site links to that person.",
      optional: true,
    },
    personTitle: {
      type: "string",
      label: "Person Job Title",
      description: "Their job title.",
      optional: true,
    },
    personCompany: {
      type: "string",
      label: "Person Company",
      description: "Their company.",
      optional: true,
    },
    personCompanyUrl: {
      type: "string",
      label: "Person Company URL",
      description: "The company's website.",
      optional: true,
    },
    personSocialUrl: {
      type: "string",
      label: "Person Social URL",
      description: "A link to their profile.",
      optional: true,
    },
    rating: {
      type: "integer",
      label: "Rating",
      description: "The stars, 1 to 5. Leave it empty for no rating.",
      options: [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Optional, up to 200 characters.",
      optional: true,
    },
    highlight: {
      type: "string",
      label: "Highlight",
      description: "The best sentence. Must be an exact part of body.",
      optional: true,
    },
    receivedAt: {
      type: "string",
      label: "Received At",
      description: "When it was given, as an ISO 8601 time. Defaults to now.",
      optional: true,
    },
    sourceName: {
      type: "string",
      label: "Source Name",
      description: "Where it came from, e.g. Email, Chat or a review site.",
      optional: true,
    },
    sourceUrl: {
      type: "string",
      label: "Source URL",
      description: "A public link to it.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language code. Defaults to the site's language.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "pending (the default) or approved.",
      options: [
        "pending",
        "approved",
      ],
      default: "pending",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tag names or IDs. A name that does not exist yet is created.",
      optional: true,
    },
    collectionIds: {
      propDefinition: [
        app,
        "testimonialCollectionIds",
      ],
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "Custom property values by key, as set up in the testimonial settings of the site, like `{\"plan\":\"pro\"}`.",
      optional: true,
    },
    pinned: {
      type: "boolean",
      label: "Pinned",
      description: "Shown first wherever it is displayed.",
      default: false,
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "Your own ID for it, such as the review or ticket ID. Sending the same one again returns the testimonial already stored instead of a copy.",
      optional: true,
    },
    allowDuplicate: {
      type: "boolean",
      label: "Allow Duplicate",
      description: "true saves it even though this person already said these words.",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/sites/${utils.segment(this.siteId)}/testimonials.json`,
      data: utils.compact({
        body: this.body,
        person_name: this.personName,
        person_email: this.personEmail,
        person_title: this.personTitle,
        person_company: this.personCompany,
        person_company_url: this.personCompanyUrl,
        person_social_url: this.personSocialUrl,
        rating: this.rating
          ? parseInt(this.rating, 10)
          : undefined,
        title: this.title,
        highlight: this.highlight,
        received_at: this.receivedAt,
        source_name: this.sourceName,
        source_url: this.sourceUrl,
        language: this.language,
        status: this.status,
        tags: utils.toList(this.tags),
        collection_ids: utils.toList(this.collectionIds),
        properties: this.properties,
        pinned: this.pinned,
        external_id: this.externalId,
        allow_duplicate: this.allowDuplicate,
        kind: "text",
      }),
    });
    $.export("$summary", `Successfully created the testimonial of '${this.personName}'`);
    return response;
  },
};
