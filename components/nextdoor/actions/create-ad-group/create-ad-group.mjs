import app from "../../nextdoor.app.mjs";

export default {
  key: "nextdoor-create-ad-group",
  name: "Create Ad Group",
  description: "Creates an ad group based on the input payload for an existing campaign. [See the documentation](https://developer.nextdoor.com/reference/adgroup-create).",
  version: "0.0.7",
  type: "action",
  props: {
    app,
    advertiserId: {
      propDefinition: [
        app,
        "advertiserId",
      ],
    },
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
        ({ advertiserId }) => ({
          advertiserId,
        }),
      ],
    },
    name: {
      description: "The name of the ad group.",
      propDefinition: [
        app,
        "name",
      ],
    },
    placements: {
      type: "string[]",
      label: "Placements",
      description: "The placements for the ad group.",
      options: [
        "RHR",
        "FEED",
        "FSF",
      ],
    },
    bid: {
      type: "object",
      label: "Bid",
      description: "The bid for the ad group.",
      default: {
        amount: "USD 10",
        pricing_type: "CPM",
      },
    },
    budget: {
      type: "object",
      label: "Budget",
      description: "The budget for the ad group. Both `amount` and `budget_type` properties are required.",
      default: {
        amount: "USD 1000",
        budget_type: "DAILY_CAP_MONEY",
      },
    },
    startTime: {
      propDefinition: [
        app,
        "startTime",
      ],
    },
    endTime: {
      propDefinition: [
        app,
        "endTime",
      ],
    },
    frecuencyCaps: {
      type: "string[]",
      label: "Frecuency Caps",
      description: "The frecuency caps for the ad group. Eligible timeunit values are `MINUTE, MINUTES, HOUR, HOURS, DAY, DAYS, WEEK, WEEKS, MONTH, MONTHS`.",
      optional: true,
      default: [
        JSON.stringify({
          max_impressions: "<int>",
          num_timeunits: "<int>",
          timeunit: "<string>",
        }),
      ],
    },
    targeting: {
      type: "object",
      label: "Targeting",
      description: "Targeting options for the ad group. Should be an object with details as specified by the API documentation.",
      optional: true,
    },
  },
  methods: {
    createAdGroup(args = {}) {
      return this.app.post({
        path: "/adgroup/create",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createAdGroup,
      advertiserId,
      campaignId,
      name,
      placements,
      bid,
      budget,
      startTime,
      endTime,
      frecuencyCaps,
      targeting,
    } = this;

    const response = await createAdGroup({
      $,
      data: {
        advertiser_id: advertiserId,
        campaign_id: campaignId,
        name,
        placements,
        bid,
        budget,
        start_time: startTime,
        end_time: endTime,
        frecuency_caps: frecuencyCaps,
        targeting,
      },
    });

    $.export("$summary", `Successfully created ad group with ID \`${response.id}\`.`);
    return response;
  },
};
