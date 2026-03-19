import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { UpdateOpportunityParams } from "../../types/requestParams";

export default defineAction({
  name: "Update Opportunity",
  description:
    "Update an existing opportunity in Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/rest/#tag/Opportunity)",
  key: "infusionsoft-update-opportunity",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infusionsoft,
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "The ID of the opportunity to update",
      optional: false,
    },
    opportunityTitle: {
      type: "string",
      label: "Opportunity Title",
      description: "The title of the opportunity",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact associated with this opportunity",
      optional: true,
    },
    stageId: {
      type: "string",
      label: "Stage ID",
      description: "The ID of the opportunity stage",
      optional: true,
    },
    userId: {
      type: "string",
      label: "Owner User ID",
      description: "The ID of the Keap user who owns this opportunity",
      optional: true,
    },
    projectedRevenueHigh: {
      type: "string",
      label: "Projected Revenue High",
      description: "The high estimate of projected revenue",
      optional: true,
    },
    projectedRevenueLow: {
      type: "string",
      label: "Projected Revenue Low",
      description: "The low estimate of projected revenue",
      optional: true,
    },
    estimatedCloseTime: {
      type: "string",
      label: "Estimated Close Time",
      description: "The estimated close date/time in ISO 8601 format",
      optional: true,
    },
    nextActionTime: {
      type: "string",
      label: "Next Action Time",
      description: "The date/time for the next action in ISO 8601 format",
      optional: true,
    },
    nextActionNotes: {
      type: "string",
      label: "Next Action Notes",
      description: "Notes about the next action to take",
      optional: true,
    },
    opportunityNotes: {
      type: "string",
      label: "Opportunity Notes",
      description: "General notes about the opportunity",
      optional: true,
    },
    includeInForecast: {
      type: "boolean",
      label: "Include in Forecast",
      description: "Whether to include this opportunity in revenue forecasts",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description:
        "JSON array of custom field objects with id and content. Example: [{\"id\": \"1\", \"content\": \"value\"}]",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const params: UpdateOpportunityParams = {
      $,
      opportunityId: this.opportunityId,
      opportunityTitle: this.opportunityTitle,
      contactId: this.contactId,
      stageId: this.stageId,
      userId: this.userId,
      projectedRevenueHigh: this.projectedRevenueHigh,
      projectedRevenueLow: this.projectedRevenueLow,
      estimatedCloseTime: this.estimatedCloseTime,
      nextActionTime: this.nextActionTime,
      nextActionNotes: this.nextActionNotes,
      opportunityNotes: this.opportunityNotes,
      includeInForecast: this.includeInForecast,
      customFields: this.customFields,
    };

    const result = await this.infusionsoft.updateOpportunity(params);

    $.export("$summary", `Successfully updated opportunity ${this.opportunityId}`);

    return result;
  },
});
