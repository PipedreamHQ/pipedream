import app from "../../prodpad.app.mjs";

export default {
  key: "prodpad-update-feedback",
  name: "Update Feedback",
  description: "Updates a feedback. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Feedback/PutFeedback).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    feedbackId: {
      propDefinition: [
        app,
        "feedbackId",
      ],
    },
    feedback: {
      optional: true,
      propDefinition: [
        app,
        "feedback",
      ],
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the feedback",
      optional: true,
      options: [
        "unsorted",
        "active",
        "archived",
      ],
    },
    externalId: {
      optional: true,
      propDefinition: [
        app,
        "externalId",
      ],
    },
    externalUrl: {
      optional: true,
      propDefinition: [
        app,
        "externalUrl",
      ],
    },
  },
  methods: {
    updateFeedback({
      feedbackId, ...args
    } = {}) {
      return this.app.update({
        path: `/feedbacks/${feedbackId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      feedbackId,
      feedback,
      state,
      externalId,
      externalUrl,
    } = this;

    const response = await this.updateFeedback({
      feedbackId,
      data: {
        feedback,
        state,
        external_links: (externalId || externalUrl) && [
          {
            external_id: externalId,
            url: externalUrl,
          },
        ],
      },
    });

    step.export("$summary", `Successfully updated feedback with ID ${response.id}`);

    return response;
  },
};
