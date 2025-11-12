import centralstationcrm from "../../centralstationcrm.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "centralstationcrm-create-deal",
  name: "Create Deal",
  description: "Creates a new deal in CentralStationCRM. [See the documentation](https://api.centralstationcrm.net/api-docs/index.html)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    centralstationcrm,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the deal",
    },
    value: {
      type: "string",
      label: "Value",
      description: "Value of the deal",
    },
    valueType: {
      type: "string",
      label: "Value Type",
      description: "The type of billing",
      options: constants.VALUE_TYPE,
    },
    targetDate: {
      type: "string",
      label: "Target Date",
      description: "The date when the deal shall be won",
    },
    valueCount: {
      type: "string",
      label: "Value Count",
      description: "Only relevant if the value_type is not `total`",
      optional: true,
    },
    currentState: {
      type: "string",
      label: "Current State",
      description: "State of the deal",
      options: constants.CURRENT_STATE,
      optional: true,
    },
    responsibleUserId: {
      propDefinition: [
        centralstationcrm,
        "responsibleUserId",
      ],
    },
  },
  async run({ $ }) {
    const { deal } = await this.centralstationcrm.createDeal({
      data: {
        deal: {
          name: this.name,
          value: this.value,
          value_type: this.valueType,
          target_date: this.targetDate,
          value_count: this.valueCount,
          current_state: this.currentState,
          user_id: this.responsibleUserId,
        },
      },
      $,
    });

    if (deal?.id) {
      $.export("summary", `Successully created deal with ID ${deal.id}.`);
    }

    return deal;
  },
};
