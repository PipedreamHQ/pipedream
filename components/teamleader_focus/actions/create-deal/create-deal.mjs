import teamleaderFocus from "../../teamleader_focus.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "teamleader_focus-create-deal",
  name: "Create Deal",
  description: "Add a new deal. [See the documentation](https://developer.teamleader.eu/#/reference/deals/deals/deals.create)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    teamleaderFocus,
    title: {
      type: "string",
      label: "Title",
      description: "Title of the new deal",
    },
    contact: {
      propDefinition: [
        teamleaderFocus,
        "contact",
      ],
    },
    phase: {
      propDefinition: [
        teamleaderFocus,
        "dealPhase",
      ],
      optional: true,
    },
    source: {
      propDefinition: [
        teamleaderFocus,
        "dealSource",
      ],
      optional: true,
    },
    user: {
      propDefinition: [
        teamleaderFocus,
        "user",
      ],
      optional: true,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Estimated value of the new deal",
      optional: true,
      reloadProps: true,
    },
    probability: {
      type: "string",
      label: "Probability",
      description: "A number between 0 and 1 (inclusive)",
      optional: true,
    },
    closeDate: {
      type: "string",
      label: "Close Date",
      description: "Estimated closing date of the new deal. Example `2017-05-09`",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.amount) {
      props.currency = {
        type: "string",
        label: "Currency",
        description: "Currency code for the new deal amount",
        options: constants.CURRENCY_CODES,
        default: "USD",
      };
    }
    return props;
  },
  async run({ $ }) {
    const data = {
      title: this.title,
      lead: {
        customer: {
          type: "contact",
          id: this.contact,
        },
      },
      phase_id: this.phase,
      source_id: this.source,
      responsible_user_id: this.user,
      estimated_probability: this.probability,
      estimated_closing_date: this.closeDate,
    };
    if (this.amount) {
      data.estimated_value = {
        amount: this.amount,
        currency: this.currency,
      };
    }

    const response = await this.teamleaderFocus.createDeal({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created deal with ID ${response.data.id}`);
    }

    return response;
  },
};
