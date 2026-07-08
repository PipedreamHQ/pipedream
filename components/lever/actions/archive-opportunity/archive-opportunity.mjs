import app from "../../lever.app.mjs";

export default {
  key: "lever-archive-opportunity",
  name: "Archive Opportunity",
  description:
    "Archives a candidate opportunity with a specified reason (hired or not hired)."
    + " Use this when a hiring decision has been made — to mark a candidate as hired or to reject them."
    + " Use **List Archive Reasons** to find valid reason IDs (filter by type `hired` or `non-hired`)."
    + " Use **Search Opportunities** to find the opportunity ID."
    + " Archiving is reversible — candidates can be unarchived in the Lever UI."
    + " Example: call with opportunityId=\"<id>\", reasonId=\"<reasonId>\", performAs=\"<userId>\" → archives the candidate (reversible in the Lever UI) and returns the updated opportunity."
    + " [See the documentation](https://hire.lever.co/developer/documentation#update-opportunity-archived-state)",
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
      description: "The ID of the opportunity to archive. Use **Search Opportunities** to find opportunity IDs.",
    },
    reasonId: {
      type: "string",
      label: "Archive Reason ID",
      description: "The ID of the archive reason. Use **List Archive Reasons** to find valid reason IDs.",
    },
    performAs: {
      propDefinition: [
        app,
        "performAs",
      ],
      description: "User ID of the person archiving — recorded in the audit trail. Use **List Users** to find user IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.performAs) params.perform_as = this.performAs;

    const response = await this.app.archiveOpportunity(this.opportunityId, {
      $,
      params,
      data: {
        reason: this.reasonId,
      },
    });
    const result = response.data ?? response;
    $.export("$summary", `Archived opportunity ${this.opportunityId} with reason ${this.reasonId}`);
    return result;
  },
};
