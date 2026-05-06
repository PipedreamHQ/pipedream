import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-update-opportunity-stage",
  name: "Update Opportunity Stage",
  description:
    "Moves a candidate to a different stage in the hiring pipeline."
    + " Use this when asked to advance, move, or update a candidate's stage."
    + " Use **List Stages** to find the target stage ID, and **Search Opportunities** to find the opportunity ID."
    + " Every stage change is logged in Lever's audit trail under the Perform As user."
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
      type: "string",
      label: "Opportunity ID",
      description: "The ID of the opportunity to move. Use **Search Opportunities** to find opportunity IDs.",
    },
    stageId: {
      type: "string",
      label: "Stage ID",
      description: "The ID of the destination stage. Use **List Stages** to find valid stage IDs.",
    },
    performAs: {
      type: "string",
      label: "Perform As (User ID)",
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
