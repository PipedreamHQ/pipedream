import app from "../../decision_journal.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "decision_journal-update-decision",
  name: "Update Decision",
  description: "Updates an existing decision. [See the documentation](https://openpm.ai/apis/decision-journal#/decisions/{decisionId})",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
    },
    context: {
      optional: true,
      propDefinition: [
        app,
        "context",
      ],
    },
    expectedOutcome: {
      optional: true,
      propDefinition: [
        app,
        "expectedOutcome",
      ],
    },
    outcomeEstimates: {
      propDefinition: [
        app,
        "outcomeEstimates",
      ],
    },
    skillLuckWeight: {
      propDefinition: [
        app,
        "skillLuckWeight",
      ],
    },
    monthsToNextReview: {
      propDefinition: [
        app,
        "monthsToNextReview",
      ],
    },
  },
  methods: {
    updateDecision({
      decisionId, ...args
    } = {}) {
      return this.app.put({
        path: `/decisions/${decisionId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateDecision,
      decisionId,
      tags,
      outcomeEstimates,
      ...data
    } = this;

    const response = await updateDecision({
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

    $.export("$summary", `Successfully updated decision with ID \`${response.id}\``);
    return response;
  },
};
