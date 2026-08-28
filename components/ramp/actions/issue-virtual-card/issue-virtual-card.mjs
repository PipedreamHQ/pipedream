// x-pd-ai: optimized
import ramp from "../../ramp.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { v4 as uuidv4 } from "uuid";

export default {
  key: "ramp-issue-virtual-card",
  name: "Issue Virtual Card",
  description: "Issue a new Ramp virtual card (spend limit) for a user. Run **List Users** to find the user ID. Works two ways: (1) **link to an existing spend program** — set **Link to Existing Spend Program** on and pass a **Spend Program ID** (run **List Spend Programs**), and the program governs the card's restrictions; or (2) **set a custom limit** — leave linking off and pass a **Total Limit per Interval** (e.g. `$500`) and an **Interval** (e.g. `MONTHLY`), optionally a per-transaction cap and allowed/blocked categories. Example: issue a $500/month card by passing the user's ID, `$500`, and `MONTHLY`. [See the documentation](https://docs.ramp.com/developer-api/v1/reference/rest/limits#post-developer-v1-limits-deferred)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ramp,
    displayName: {
      type: "string",
      label: "Virtual Card Name",
      description: "A name for the virtual card, e.g. `Marketing SaaS`.",
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
      description: "Set to true to link this card to an existing spend program (then provide a **Spend Program ID** below). Leave off to set a custom limit instead.",
      optional: true,
    },
    spendProgramId: {
      propDefinition: [
        ramp,
        "spendProgramId",
      ],
      description: "The spend program to link the card to — a Ramp UUID, e.g. `e9d30f12-c73a-463b-bc5f-b200396359d2`. Run the **List Spend Programs** action to find valid IDs. Required when **Link to Existing Spend Program** is on; leave empty to set a custom limit.",
    },
    limit: {
      type: "string",
      label: "Total Limit per Interval (USD)",
      description: "Total amount allowed per interval, in USD (e.g. `$500`). Required for a custom limit (when not linking to a spend program); ignored when a Spend Program ID is set.",
      optional: true,
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "Reset interval for the custom limit (e.g. `MONTHLY`). Required for a custom limit.",
      options: constants.INTERVALS,
      optional: true,
    },
    transactionAmountLimit: {
      type: "string",
      label: "Maximum Spend per Transaction (USD)",
      description: "Maximum amount per single transaction, in USD (e.g. `$100`). Optional; applies to a custom limit.",
      optional: true,
    },
    allowedCategories: {
      propDefinition: [
        ramp,
        "allowedCategories",
      ],
    },
    blockedCategories: {
      propDefinition: [
        ramp,
        "blockedCategories",
      ],
    },
    primaryCardEnabled: {
      type: "boolean",
      label: "Primary Card Enabled",
      description: "Whether the user's physical card can be linked to this limit. Applies to a custom limit.",
      optional: true,
    },
    reimbursementsEnabled: {
      type: "boolean",
      label: "Reimbursements Enabled",
      description: "Whether reimbursements can be submitted against this limit. Applies to a custom limit.",
      optional: true,
    },
    isShareable: {
      type: "boolean",
      label: "Is Shareable",
      description: "Whether the spend limit is shareable among multiple users.",
      optional: true,
    },
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
    if (this.linkToSpendProgram && !this.spendProgramId) {
      throw new ConfigurationError("To link to a spend program, enable it and provide a Spend Program ID — run List Spend Programs to find one.");
    }
    if (!this.linkToSpendProgram && this.spendProgramId) {
      throw new ConfigurationError("A Spend Program ID was provided but 'Link to Existing Spend Program' is off — turn it on to link, or clear the Spend Program ID to set a custom limit.");
    }
    if (!this.linkToSpendProgram && (this.limit === undefined || this.interval === undefined)) {
      throw new ConfigurationError("A custom card limit needs both a Total Limit per Interval (USD) and an Interval — provide both, or link to a spend program instead.");
    }
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
