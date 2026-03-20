import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { UpdateOpportunityParams } from "../../types/requestParams";

export default defineAction({
  name: "Update Opportunity",
  description:
    "Update an existing opportunity in Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/rest/#tag/Opportunity/operation/updatePropertiesOnOpportunity)",
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
      propDefinition: [
        infusionsoft,
        "opportunityId",
      ],
    },
    opportunityTitle: {
      type: "string",
      label: "Opportunity Title",
      description: "The title of the opportunity",
      optional: true,
    },
    contactId: {
      propDefinition: [
        infusionsoft,
        "contactId",
      ],
      optional: true,
    },
    stageId: {
      propDefinition: [
        infusionsoft,
        "stageId",
      ],
      optional: true,
    },
    userId: {
      propDefinition: [
        infusionsoft,
        "userId",
      ],
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
    const opportunityId = String(this.opportunityId ?? "").trim();
    if (!opportunityId) {
      throw new Error("Opportunity ID is required");
    }

    const mutableFields = {
      opportunityTitle: this.opportunityTitle,
      contactId: this.contactId
        ? String(this.contactId)
        : undefined,
      stageId: this.stageId
        ? String(this.stageId)
        : undefined,
      userId: this.userId
        ? String(this.userId)
        : undefined,
      projectedRevenueHigh: this.projectedRevenueHigh,
      projectedRevenueLow: this.projectedRevenueLow,
      estimatedCloseTime: this.estimatedCloseTime,
      nextActionTime: this.nextActionTime,
      nextActionNotes: this.nextActionNotes,
      opportunityNotes: this.opportunityNotes,
      includeInForecast: this.includeInForecast,
      customFields: this.customFields,
    };
    const hasMutable = Object.values(mutableFields).some((v) => v != null && (typeof v === "boolean" || String(v).trim() !== ""));
    if (!hasMutable) {
      throw new Error("At least one field to update is required (opportunityTitle, contactId, stageId, userId, projectedRevenueHigh, projectedRevenueLow, estimatedCloseTime, nextActionTime, nextActionNotes, opportunityNotes, includeInForecast, or customFields)");
    }

    const params: UpdateOpportunityParams = {
      $,
      opportunityId,
      ...mutableFields,
    };

    const result = await this.infusionsoft.updateOpportunity(params);

    $.export("$summary", `Successfully updated opportunity ${opportunityId}`);

    return result;
  },
});
