import app from "../../tiktok_ads_manager.app.mjs";

export default {
  key: "tiktok_ads_manager-create-or-update-ad-group",
  name: "Create or Update Ad Group",
  description:
    "Create a new TikTok ad group or update an existing one."
    + " Omit `adgroup_id` to create; provide it to update."
    + " Ad groups control placement, targeting, budget, schedule, bidding, and optimization within a campaign."
    + " `billing_event` must correspond to the chosen `optimization_goal` — e.g., CLICK → CPC, CONVERT/INSTALL → OCPM, REACH/SHOW → CPM, ENGAGED_VIEW → CPV."
    + " Use campaign IDs from **Create or Update Campaign** or **List Campaigns**."
    + " For create, see [documentation](https://business-api.tiktok.com/portal/docs/create-an-ad-group-reference/v1.3)."
    + " For update, see [documentation](https://business-api.tiktok.com/portal/docs/update-an-ad-group/v1.3).",
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
    adgroupId: {
      type: "string",
      label: "Ad Group ID",
      description: "ID of an existing ad group to update. Omit to create a new ad group. Use **List Ad Groups** to find existing IDs.",
      optional: true,
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "Campaign to place this ad group in. Required for new ad groups. Use **List Campaigns** to find campaign IDs.",
      optional: true,
    },
    adgroupName: {
      type: "string",
      label: "Ad Group Name",
      description: "Name for the ad group. Maximum 512 characters.",
    },
    placementType: {
      type: "string",
      label: "Placement Type",
      description: "`PLACEMENT_TYPE_AUTOMATIC` lets TikTok optimize placements. `PLACEMENT_TYPE_NORMAL` requires you to specify `placements` manually.",
      optional: true,
      options: [
        "PLACEMENT_TYPE_AUTOMATIC",
        "PLACEMENT_TYPE_NORMAL",
      ],
    },
    placements: {
      type: "string[]",
      label: "Placements",
      description: "Required when `placement_type` is `PLACEMENT_TYPE_NORMAL`. Apps where your ads will be delivered. Example: `[\"PLACEMENT_TIKTOK\"]`.",
      optional: true,
      options: [
        "PLACEMENT_TIKTOK",
        "PLACEMENT_PANGLE",
        "PLACEMENT_GLOBAL_APP_BUNDLE",
      ],
    },
    budgetMode: {
      propDefinition: [
        app,
        "budgetMode",
      ],
    },
    budget: {
      propDefinition: [
        app,
        "budget",
      ],
    },
    scheduleType: {
      type: "string",
      label: "Schedule Type",
      description: "`SCHEDULE_FROM_NOW` starts immediately; end time is auto-set 10 years out. `SCHEDULE_START_END` requires both start and end times. `budget_mode: BUDGET_MODE_TOTAL` requires `SCHEDULE_START_END`.",
      options: [
        "SCHEDULE_FROM_NOW",
        "SCHEDULE_START_END",
      ],
    },
    scheduleStartTime: {
      type: "string",
      label: "Schedule Start Time",
      description: "Ad group start time in UTC+0, format `YYYY-MM-DD HH:MM:SS`. Can be up to 12 hours before current time.",
    },
    scheduleEndTime: {
      type: "string",
      label: "Schedule End Time",
      description: "Ad group end time in UTC+0, format `YYYY-MM-DD HH:MM:SS`. Required when `schedule_type` is `SCHEDULE_START_END` or `budget_mode` is `BUDGET_MODE_TOTAL`.",
      optional: true,
    },
    optimizationGoal: {
      type: "string",
      label: "Optimization Goal",
      description: "What TikTok optimizes for. Common values: `CLICK`, `CONVERT`, `INSTALL`, `REACH`, `SHOW`, `ENGAGED_VIEW`, `IN_APP_EVENT`, `VALUE`.",
    },
    billingEvent: {
      type: "string",
      label: "Billing Event",
      description: "What you pay for. Must correspond to `optimization_goal`: CLICK/PAGE_VISIT → `CPC`; CONVERT/INSTALL/IN_APP_EVENT/LEAD_GENERATION → `OCPM`; REACH/SHOW → `CPM`; ENGAGED_VIEW/ENGAGED_VIEW_FIFTEEN → `CPV`.",
      options: [
        "CPC",
        "CPM",
        "CPV",
        "OCPM",
      ],
    },
    pacing: {
      type: "string",
      label: "Pacing",
      description: "`PACING_MODE_SMOOTH` distributes budget evenly over the schedule. `PACING_MODE_FAST` spends budget and produces results as fast as possible.",
      options: [
        "PACING_MODE_SMOOTH",
        "PACING_MODE_FAST",
      ],
    },
    bidType: {
      type: "string",
      label: "Bid Type",
      description: "Bidding strategy. `BID_TYPE_NO_BID` = automatic. `BID_TYPE_CUSTOM` = target cost cap. See TikTok bidding documentation for details.",
      optional: true,
      options: [
        "BID_TYPE_NO_BID",
        "BID_TYPE_CUSTOM",
      ],
    },
    bidPrice: {
      type: "string",
      label: "Bid Price",
      description: "Target bid amount in the account currency. Required when `bid_type` is `BID_TYPE_CUSTOM`.",
      optional: true,
    },
    locationIds: {
      type: "string[]",
      label: "Location IDs",
      description: "Target geographic locations by TikTok location ID. Example: `6252001` = United States, `6269131` = United Kingdom.",
      optional: true,
    },
    ageGroups: {
      type: "string[]",
      label: "Age Groups",
      description: "Target age groups. Leave blank for all ages.",
      optional: true,
      options: [
        "AGE_13_17",
        "AGE_18_24",
        "AGE_25_34",
        "AGE_35_44",
        "AGE_45_54",
        "AGE_55_100",
      ],
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "Target gender. `GENDER_UNLIMITED` targets all genders.",
      optional: true,
      options: [
        "GENDER_UNLIMITED",
        "GENDER_MALE",
        "GENDER_FEMALE",
      ],
    },
    interestCategoryIds: {
      type: "string[]",
      label: "Interest Category IDs",
      description: "TikTok interest category IDs for audience targeting. Leave blank to skip interest targeting.",
      optional: true,
    },
    operationStatus: {
      propDefinition: [
        app,
        "operationStatus",
      ],
    },
  },
  async run({ $ }) {
    const isUpdate = !!this.adgroupId;

    const body = {
      advertiser_id: this.advertiserId,
      campaign_id: this.campaignId,
      adgroup_name: this.adgroupName,
      placement_type: this.placementType,
      placements: this.placements,
      budget_mode: this.budgetMode,
      budget: this.budget
        ? parseFloat(this.budget)
        : undefined,
      schedule_type: this.scheduleType,
      schedule_start_time: this.scheduleStartTime,
      schedule_end_time: this.scheduleEndTime,
      optimization_goal: this.optimizationGoal,
      billing_event: this.billingEvent,
      pacing: this.pacing,
      bid_type: this.bidType,
      bid_price: this.bidPrice
        ? parseFloat(this.bidPrice)
        : undefined,
      location_ids: this.locationIds,
      age_groups: this.ageGroups,
      gender: this.gender,
      interest_category_ids: this.interestCategoryIds,
      operation_status: this.operationStatus,
    };

    if (isUpdate) body.adgroup_id = this.adgroupId;

    const response = await (isUpdate
      ? this.app.updateAdGroup({
        $,
        data: body,
      })
      : this.app.createAdGroup({
        $,
        data: body,
      }));

    const adgroupId = response?.data?.adgroup_id;
    const action = isUpdate
      ? "Updated"
      : "Created";
    $.export("$summary", `${action} ad group${adgroupId
      ? ` ${adgroupId}`
      : ""}${this.adgroupName
      ? `: ${this.adgroupName}`
      : ""}`);
    return response;
  },
};
