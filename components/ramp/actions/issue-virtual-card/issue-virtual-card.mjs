import ramp from "../../ramp.app.mjs";
import { v4 as uuidv4 } from "uuid";

export default {
  key: "ramp-issue-virtual-card",
  name: "Issue Virtual Card",
  description: "Creates a new virtual card for a given user. [See the documentation](https://docs.ramp.com/developer-api/v1/reference/rest/limits#post-developer-v1-limits-deferred)",
  version: "0.0.3",
  type: "action",
  props: {
    ramp,
    displayName: {
      type: "string",
      label: "Virtual Card Name",
      description: "The name of the virtual card",
    },
    userId: {
      propDefinition: [
        ramp,
        "userId",
      ],
    },
    linkToSpendProgram: {
      type: "boolean",
      label: "Link to Existing Spend Program",
      description: "Whether to link the card to an existing spend program",
      reloadProps: true,
    },
    spendProgramId: {
      propDefinition: [
        ramp,
        "spendProgramId",
      ],
      hidden: true,
    },
    allowedCategories: {
      propDefinition: [
        ramp,
        "allowedCategories",
      ],
      hidden: true,
    },
    blockedCategories: {
      propDefinition: [
        ramp,
        "blockedCategories",
      ],
      hidden: true,
    },
  },
  async additionalProps(props) {
    const newProps = {};
    if (this.linkToSpendProgram === undefined) {
      return newProps;
    }
    if (this.linkToSpendProgram) {
      props.spendProgramId.hidden = false;
    } else if (this.linkToSpendProgram === false) {
      props.spendProgramId.hidden = true;
      props.allowedCategories.hidden = false;
      props.blockedCategories.hidden = false;
      newProps.primaryCardEnabled = {
        type: "boolean",
        label: "Primary Card Enabled",
        description: "Dictates whether the user's physical card can be linked to this limit",
      };
      newProps.reimbursementsEnabled = {
        type: "boolean",
        label: "Reimbursements Enabled",
        description: "Dictates whether reimbursements can be submitted against this limit",
      };
      newProps.isShareable = {
        type: "boolean",
        label: "Is Shareable",
        description: "Dictates whether the spend limit is shareable among multiple users",
        optional: true,
      };
    }
    newProps.limit = {
      type: "string",
      label: "Total Limit per Interval (USD)",
      description: "Total amount limit per interval in USD",
    };
    newProps.interval = {
      type: "string",
      label: "Interval",
      description: "Time interval to apply limit to",
      options: [
        "ANNUAL",
        "DAILY",
        "MONTHLY",
        "QUARTERLY",
        "TERTIARY",
        "TOTAL",
        "WEEKLY",
        "YEARLY",
      ],
    };
    newProps.transactionAmountLimit = {
      type: "string",
      label: "Maximum Spend per Transaction (USD)",
      description: "Max amount per transaction in USD",
      optional: true,
    };
    return newProps;
  },
  methods: {
    formatUSD(amount) {
      if (!amount) {
        return undefined;
      }
      return +(amount.split("$").pop()) * 100;
    },
  },
  async run({ $ }) {
    const response = await this.ramp.createLimit({
      $,
      data: {
        idempotency_key: uuidv4(),
        display_name: this.displayName,
        user_id: this.userId,
        spend_program_id: this.spendProgramId,
        permitted_spend_types: !this.linkToSpendProgram
          ? {
            primary_card_enabled: this.primaryCardEnabled,
            reimbursements_enabled: this.reimbursementsEnabled,
          }
          : undefined,
        spending_restrictions: !this.spendProgramId
          ? {
            limit: {
              amount: this.formatUSD(this.limit),
            },
            interval: this.interval,
            transaction_amount_limit: this.transactionAmountLimit
              ? {
                amount: this.formatUSD(this.transactionAmountLimit),
              }
              : undefined,
            allowed_categories: this.allowedCategories,
            blocked_categories: this.blockedCategories,
          }
          : undefined,
        is_shareable: this.isShareable,
      },
    });
    $.export("$summary", `Successfully created new limit with ID ${response.id}`);
    return response;
  },
};
