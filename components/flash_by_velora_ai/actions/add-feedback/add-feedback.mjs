import app from "../../flash_by_velora_ai.app.mjs";

export default {
  key: "flash_by_velora_ai-add-feedback",
  name: "Add Feedback",
  description: "Adds customer feedback.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    feedback: {
      type: "string",
      label: "Feedback",
      description: "Actual text customer feedback.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the customer feedback, if any.",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "Source where the feedback was received, for example, `GitHub`, `Slack`, etc.",
      optional: true,
    },
    upvote: {
      type: "integer",
      label: "Upvote",
      description: "Count of upvotes for the feedback.",
      optional: true,
    },
    downvote: {
      type: "integer",
      label: "Downvote",
      description: "Count of downvotes for the feedback.",
      optional: true,
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "Name of the customer contact who provided the feedback.",
      optional: true,
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "Email of the customer contact who provided the feedback.",
      optional: true,
    },
    handle: {
      type: "string",
      label: "Handle",
      description: "Platform specific customer contact handle. Eg. `@pipedream`.",
      optional: true,
    },
    handleType: {
      type: "string",
      label: "Handle Type",
      description: "Platform which the contact handle belongs to. Eg. `Twitter`, `GitHub`, etc.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Name of customer company to which the customer contact who provided feedback belongs.",
      optional: true,
    },
    companyDomain: {
      type: "string",
      label: "Company Domain",
      description: "Email domain of customer company to which the customer contact who provided feedback belongs. Eg. `pipedream.com`.",
      optional: true,
    },
    feedbackAt: {
      type: "string",
      label: "Feedback At",
      description: "Date and time, when the feedback was received. Eg. `2021-01-01T00:00:00`.",
      optional: true,
    },
  },
  methods: {
    addFeedback(args = {}) {
      return this.app.post({
        path: "/add-feedback",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      addFeedback,
      feedback,
      title,
      source,
      upvote,
      downvote,
      contactName,
      contactEmail,
      handle,
      handleType,
      companyName,
      companyDomain,
      feedbackAt,
    } = this;

    const response = await addFeedback({
      $,
      data: {
        feedback,
        title,
        source,
        upvote,
        downvote,
        contact_name: contactName,
        contact_email: contactEmail,
        handle,
        handle_type: handleType,
        company_name: companyName,
        company_domain: companyDomain,
        feedback_at: feedbackAt,
      },
    });
    $.export("$summary", "Successfully added feedback.");
    return response;
  },
};
