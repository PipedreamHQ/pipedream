import app from "../../decision_journal.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "decision_journal-create-decision",
  name: "Create Decision",
  description: "Creates a new decision in the Decision Journal. [See the documentation](https://openpm.ai/apis/decision-journal#/decisions)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
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
      propDefinition: [
        app,
        "context",
      ],
    },
    expectedOutcome: {
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
    createDecision(args = {}) {
      return this.app.post({
        path: "/decisions",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createDecision,
      tags,
      outcomeEstimates,
      ...data
    } = this;

    const response = await createDecision({
      $,
      data: {
        data: {
          tags: utils.parseArray(tags),
          outcomeEstimates: utils.parseArrayAndMap(outcomeEstimates),
          ...utils.filterProps(data),
        },
      },
    });

    $.export("$summary", `Successfully created a new decision with ID: \`${response.id}\``);
    return response;
  },
};
