import { STAGE_OPTIONS } from "../../common/constants.mjs";
import onepagecrm from "../../onepagecrm.app.mjs";

export default {
  key: "onepagecrm-update-deal",
  name: "Update Deal",
  description: "Updates an existing deal's details in OnePageCRM. [See the documentation](https://developer.onepagecrm.com/api/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    onepagecrm,
    dealId: {
      propDefinition: [
        onepagecrm,
        "dealId",
      ],
    },
    contactId: {
      propDefinition: [
        onepagecrm,
        "contactId",
      ],
      optional: true,
    },
    ownerId: {
      propDefinition: [
        onepagecrm,
        "userId",
      ],
      optional: true,
    },
    pipelineId: {
      propDefinition: [
        onepagecrm,
        "pipelineId",
      ],
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the deal.",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "Extra notes related to the deal (supports [b]bold[/b] and [i]italic[/i] formatting).",
      optional: true,
    },
    stage: {
      type: "integer",
      label: "Stage",
      description: "A numerical representation of the progress of a pending deal.",
      options: STAGE_OPTIONS,
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the deal.",
      options: [
        "pending",
        "won",
        "lost",
      ],
      optional: true,
    },
    expectedCloseDate: {
      type: "string",
      label: "Expected Close Date",
      description: "The date the deal is expected to close. **Format: YYYY-MM-DD**. **(status should be `pending`)**.",
      optional: true,
    },
    closeDate: {
      type: "string",
      label: "Close Date",
      description: "The date the deal actually closed. **(status should be `won` or `lost`)`**.",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Creation date of the deal.",
      optional: true,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The monitary value of the deal (per month, if multi-month deal).",
      optional: true,
    },
    months: {
      type: "integer",
      label: "Months",
      description: "Number of months the deal is to be paid for. (1 for regular deals, 2+ for multi-month).",
      default: 1,
      optional: true,
    },
    cost: {
      type: "string",
      label: "Cost",
      description: "The monitary cost of the deal",
      optional: true,
    },
    commissionBase: {
      type: "string",
      label: "Commission Base",
      description: "Base used to calculate the commission of the deal.",
      options: [
        "amount",
        "margin",
      ],
      optional: true,
    },
    commissionType: {
      type: "string",
      label: "Commission Type",
      description: "Type of commission for the deal.",
      options: [
        "none",
        "percentage",
        "absolute",
      ],
      optional: true,
    },
    commission: {
      type: "string",
      label: "Commission",
      description: "Commission payable for the deal.",
      optional: true,
    },
    commissionPercentage: {
      type: "string",
      label: "Commission Percentage",
      description: "Commission percentage for the deal.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data: { deal } } = await this.onepagecrm.getDeal({
      $,
      dealId: this.dealId,
    });
    if (this.contactId) deal.contact_id = this.contactId;
    if (this.ownerId) deal.owner_id = this.ownerId;
    if (this.pipelineId) deal.pipeline_id = this.pipelineId;
    if (this.name) deal.name = this.name;
    if (this.text) deal.text = this.text;
    if (this.stage) deal.stage = this.stage;
    if (this.status) deal.status = this.status;
    if (this.expectedCloseDate) deal.expected_close_date = this.expectedCloseDate;
    if (this.closeDate) deal.close_date = this.closeDate;
    if (this.date) deal.date = this.date;
    if (this.amount) deal.amount = this.amount;
    if (this.months) deal.months = this.months;
    if (this.cost) deal.cost = this.cost;
    if (this.commissionBase) deal.commission_base = this.commissionBase;
    if (this.commissionType) deal.commission_type = this.commissionType;
    if (this.commission) deal.commission = this.commission;
    if (this.commissionPercentage) deal.commission_percentage = this.commissionPercentage;

    const response = await this.onepagecrm.updateDeal({
      $,
      dealId: this.dealId,
      data: deal,
    });

    $.export("$summary", `Successfully updated deal with ID ${this.dealId}`);
    return response;
  },
};
