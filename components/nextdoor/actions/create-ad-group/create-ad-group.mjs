import app from "../../nextdoor.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "nextdoor-create-ad-group",
  name: "Create Ad Group",
  description: "Creates an ad group based on the input payload for an existing campaign. [See the documentation](https://developer.nextdoor.com/reference/adgroup-create).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    bidAmount: {
      type: "string",
      label: "Bid Amount",
      description: "The bid amount for the ad group. The value must be a string in the format `USD 10` as an example.",
    },
    bidPricingType: {
      type: "string",
      label: "Bid Pricing Type",
      description: "The bid pricing type for the ad group. The value must be one of `CPM`.",
      options: [
        "CPM",
      ],
    },
    budgetAmount: {
      type: "string",
      label: "Budget Amount",
      description: "The budget amount for the ad group. The value must be a string in the format `USD 10` as an example.",
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
    numberOfFrequencyCaps: {
      type: "integer",
      label: "Number Of Frequency Caps",
      description: "The number of frequency caps to be collected. Defaults to `1`.",
      default: 1,
      reloadProps: true,
    },
  },
  methods: {
    frequencyCapsPropsMapper(prefix) {
      const {
        [`${prefix}maxImpressions`]: maxImpressions,
        [`${prefix}numTimeunits`]: numTimeunits,
        [`${prefix}timeunit`]: timeunit,
      } = this;

      return {
        max_impressions: maxImpressions,
        num_timeunits: numTimeunits,
        timeunit,
      };
    },
    getFrequencyCapsPropDefinitions({
      prefix,
      label,
    } = {}) {
      return {
        [`${prefix}maxImpressions`]: {
          type: "integer",
          label: `${label} - Max Impressions`,
          description: "The maximum number of impressions.",
        },
        [`${prefix}numTimeunits`]: {
          type: "integer",
          label: `${label} - Number of Time Units`,
          description: "The number of time units for frequency caps.",
        },
        [`${prefix}timeunit`]: {
          type: "string",
          label: `${label} - Time Unit`,
          description: "The time unit for frequency caps.",
          options: [
            "MINUTE",
            "HOUR",
            "DAY",
            "WEEK",
            "MONTH",
          ],
        },
      };
    },
    createAdGroup(args = {}) {
      return this.app.post({
        path: "/adgroup/create",
        ...args,
      });
    },
  },
  async additionalProps() {
    const {
      numberOfFrequencyCaps,
      getFrequencyCapsPropDefinitions,
    } = this;

    return utils.getAdditionalProps({
      numberOfFields: numberOfFrequencyCaps,
      fieldName: "frequency cap",
      getPropDefinitions: getFrequencyCapsPropDefinitions,
    });
  },
  async run({ $ }) {
    const {
      createAdGroup,
      advertiserId,
      campaignId,
      name,
      placements,
      bidAmount,
      bidPricingType,
      budgetAmount,
      startTime,
      endTime,
      numberOfFrequencyCaps,
      frequencyCapsPropsMapper,
    } = this;

    const response = await createAdGroup({
      $,
      data: {
        advertiser_id: advertiserId,
        campaign_id: campaignId,
        name,
        placements: utils.parseArray(placements),
        bid: {
          amount: bidAmount,
          pricing_type: bidPricingType,
        },
        budget: {
          amount: budgetAmount,
          budget_type: "DAILY_CAP_MONEY",
        },
        start_time: startTime,
        end_time: endTime,
        frequency_caps: utils.getFieldsProps({
          numberOfFields: numberOfFrequencyCaps,
          fieldName: "frequency cap",
          propsMapper: frequencyCapsPropsMapper,
        }),
      },
    });

    $.export("$summary", `Successfully created ad group with ID \`${response.id}\`.`);
    return response;
  },
};
