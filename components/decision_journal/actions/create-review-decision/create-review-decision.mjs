import app from "../../decision_journal.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "decision_journal-create-review-decision",
  name: "Create Review Decision",
  description: "Creates a review for a decision in Decision Journal. [See the documentation](https://openpm.ai/apis/decision-journal#/decisions/{decisionId}/reviews)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    decisionId: {
      propDefinition: [
        app,
        "decisionId",
      ],
    },
    accuracyScore: {
      propDefinition: [
        app,
        "accuracyScore",
      ],
    },
    actualOutcome: {
      propDefinition: [
        app,
        "actualOutcome",
      ],
    },
    learningsAndReview: {
      propDefinition: [
        app,
        "learningsAndReview",
      ],
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
    },
    skillLuckWeight: {
      propDefinition: [
        app,
        "skillLuckWeight",
      ],
    },
    monthsToNextReview: {
      optional: true,
      propDefinition: [
        app,
        "monthsToNextReview",
      ],
    },
    outcomeEstimates: {
      description: "An array of outcome estimates in JSON string format. For each estimate, the format is `{\"text\": \"A description of an outcome estimate\", \"probability\": \"0.50\", \"itHappened\": true }`",
      propDefinition: [
        app,
        "outcomeEstimates",
      ],
    },
  },
  methods: {
    createReview({
      decisionId, ...args
    } = {}) {
      return this.app.post({
        path: `/decisions/${decisionId}/reviews`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createReview,
      decisionId,
      tags,
      outcomeEstimates,
      ...data
    } = this;

    const response = await createReview({
      $,
      decisionId,
      data: {
        data: {
          tags: utils.parseArray(tags),
          outcomeEstimates: utils.parseArrayAndMap(outcomeEstimates),
          ...utils.filterProps(data),
        },
      },
    });

    $.export("$summary", `Successfully created a review decision with ID: ${response.id}`);
    return response;
  },
};
