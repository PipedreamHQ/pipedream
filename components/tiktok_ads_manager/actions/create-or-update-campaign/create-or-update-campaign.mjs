import app from "../../tiktok_ads_manager.app.mjs";

export default {
  key: "tiktok_ads_manager-create-or-update-campaign",
  name: "Create or Update Campaign",
  description:
    "Create a new TikTok campaign or update an existing one."
    + " Omit `campaign_id` to create; provide it to update."
    + " `objective_type`, `budget_mode`, and `budget` are required when creating but are not accepted by the update endpoint."
    + " Common objective types: `REACH`, `TRAFFIC`, `VIDEO_VIEWS`, `LEAD_GENERATION`, `APP_PROMOTION`, `CONVERSIONS`, `PRODUCT_SALES`."
    + " After creating a campaign, use **Create or Update Ad Group** to add targeting and budget."
    + " For create, see [documentation](https://business-api.tiktok.com/portal/docs/create-a-campaign/v1.3)."
    + " For update, see [documentation](https://business-api.tiktok.com/portal/docs/update-a-campaign/v1.3).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    advertiserId: {
      propDefinition: [
        app,
        "advertiserId",
      ],
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "ID of an existing campaign to update. Omit to create a new campaign. Use **List Campaigns** to find existing IDs.",
      optional: true,
    },
    campaignName: {
      type: "string",
      label: "Campaign Name",
      description: "Campaign name. Required when creating. Maximum 512 characters.",
      optional: true,
    },
    objectiveType: {
      type: "string",
      label: "Objective Type",
      description: "Advertising objective. Required when creating. Not accepted by the update endpoint.",
      optional: true,
      options: [
        "REACH",
        "TRAFFIC",
        "VIDEO_VIEWS",
        "LEAD_GENERATION",
        "APP_PROMOTION",
        "CONVERSIONS",
        "PRODUCT_SALES",
        "RF_REACH",
        "ENGAGEMENT",
        "WEB_CONVERSIONS",
      ],
    },
    budgetMode: {
      propDefinition: [
        app,
        "budgetMode",
      ],
      optional: true,
      description: "Budget mode. Required when creating (except for RF_REACH objective). Not accepted by the update endpoint. `BUDGET_MODE_INFINITE` = no budget cap (non-CBO only).",
    },
    budget: {
      propDefinition: [
        app,
        "budget",
      ],
      optional: true,
      description: "Campaign budget. Required when creating with `BUDGET_MODE_DAY`, `BUDGET_MODE_DYNAMIC_DAILY_BUDGET`, or `BUDGET_MODE_TOTAL`. When updating, the new budget must be at least 105% of current spend.",
    },
    operationStatus: {
      propDefinition: [
        app,
        "operationStatus",
      ],
      description: "Status when created. Only used for create — to update status after creation use the /campaign/status/update/ endpoint.",
    },
  },
  async run({ $ }) {
    const isUpdate = !!this.campaignId;

    let response;

    if (isUpdate) {
      response = await this.app.updateCampaign({
        $,
        data: {
          advertiser_id: this.advertiserId,
          campaign_id: this.campaignId,
          campaign_name: this.campaignName,
          budget: this.budget
            ? parseFloat(this.budget)
            : undefined,
        },
      });
    } else {
      response = await this.app.createCampaign({
        $,
        data: {
          advertiser_id: this.advertiserId,
          campaign_name: this.campaignName,
          objective_type: this.objectiveType,
          budget_mode: this.budgetMode,
          budget: this.budget
            ? parseFloat(this.budget)
            : undefined,
          operation_status: this.operationStatus,
        },
      });
    }

    const campaignId = response?.data?.campaign_id;
    const action = isUpdate
      ? "Updated"
      : "Created";
    $.export("$summary", `${action} campaign${campaignId
      ? ` ${campaignId}`
      : ""}${this.campaignName
      ? `: ${this.campaignName}`
      : ""}`);
    return response;
  },
};
