import app from "../../lever.app.mjs";

export default {
  key: "lever-update-opportunity-stage",
  name: "Update Opportunity Stage",
  description:
    "Moves a candidate to a different stage in the hiring pipeline."
    + " Use this when asked to advance, move, or update a candidate's stage."
    + " Use **List Stages** to find the target stage ID, and **Search Opportunities** to find the opportunity ID."
    + " Every stage change is logged in Lever's audit trail under the Perform As user."
    + " Example: call with opportunityId=\"<id>\", stageId=\"<stageId>\", performAs=\"<userId>\" → moves the candidate to that stage and returns the updated opportunity."
    + " [See the documentation](https://hire.lever.co/developer/documentation#update-stage-on-an-opportunity)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    opportunityId: {
      propDefinition: [
        app,
        "opportunityId",
      ],
      description: "The ID of the opportunity to move. Use **Search Opportunities** to find opportunity IDs.",
    },
    stageId: {
      propDefinition: [
        app,
        "stageId",
      ],
      description: "The ID of the destination stage. Use **List Stages** to find valid stage IDs.",
      optional: false,
    },
    performAs: {
      propDefinition: [
        app,
        "performAs",
      ],
      description: "User ID of the person making this change — recorded in the audit trail. Use **List Users** to find user IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.performAs) params.perform_as = this.performAs;

    const response = await this.app.updateOpportunityStage(this.opportunityId, {
      $,
      params,
      data: {
        stage: this.stageId,
      },
    });
    const result = response.data ?? response;
    $.export("$summary", `Moved opportunity ${this.opportunityId} to stage ${this.stageId}`);
    return result;
  },
};
