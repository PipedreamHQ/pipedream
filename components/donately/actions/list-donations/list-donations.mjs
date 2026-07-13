import donately from "../../donately.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "donately-list-donations",
  name: "List Donations",
  description: "List donations for an account. [See the documentation](https://developer.donate.ly/api/#donations)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: true,
  },
  props: {
    donately,
    accountId: {
      propDefinition: [
        donately,
        "accountId",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter donations by status.",
      options: [
        "completed",
        "pending",
        "refunded",
        "rejected",
      ],
      optional: true,
    },
    personId: {
      type: "string",
      label: "Person ID",
      description: "Filter by donor. Use the **List People** action to get a list of person IDs.",
      optional: true,
    },
    campaignId: {
      propDefinition: [
        donately,
        "campaignId",
      ],
    },
    fundraiserId: {
      type: "string",
      label: "Fundraiser ID",
      description: "Filter by fundraiser. Use the **List Fundraisers** action to get a list of fundraiser IDs.",
      optional: true,
    },
    donationType: {
      type: "string",
      label: "Donation Type",
      description: "Filter by donation type.",
      options: [
        "cc",
        "cash_or_check",
      ],
      optional: true,
    },
    recurring: {
      type: "boolean",
      label: "Recurring",
      description: "Filter by recurring donations.",
      optional: true,
    },
    anonymous: {
      type: "boolean",
      label: "Anonymous",
      description: "Filter by anonymous donations.",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "ISO currency code (e.g. `usd`, `cad`).",
      optional: true,
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Text search.",
      optional: true,
    },
    amountInCents: {
      type: "integer",
      label: "Amount in Cents",
      description: "Filter by donation amount in cents.",
      optional: true,
    },
    created: {
      type: "object",
      label: "Created",
      description: "Date range filter for when donations were created. Use `gt` and/or `lt` with Unix timestamps (e.g. `{\"gt\": 1704067200, \"lt\": 1706745600}`).",
      optional: true,
    },
    updated: {
      type: "object",
      label: "Updated",
      description: "Date range filter for when donations were updated. Use `gt` and/or `lt` with Unix timestamps (e.g. `{\"gt\": 1704067200, \"lt\": 1706745600}`).",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        donately,
        "maxResults",
      ],
    },
    sort: {
      propDefinition: [
        donately,
        "sort",
      ],
    },
    orderBy: {
      propDefinition: [
        donately,
        "orderBy",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.donately.getPaginatedResources(this.donately.listDonations, {
      $,
      params: {
        account_id: this.accountId,
        status: this.status,
        person_id: this.personId,
        campaign_id: this.campaignId,
        fundraiser_id: this.fundraiserId,
        donation_type: this.donationType,
        recurring: this.recurring,
        anonymous: this.anonymous,
        currency: this.currency,
        keyword: this.keyword,
        amount_in_cents: this.amountInCents,
        created: parseJson(this.created),
        updated: parseJson(this.updated),
        sort: this.sort,
        order_by: this.orderBy,
      },
    }, this.maxResults);
    const count = response?.length ?? 0;
    $.export("$summary", `Found ${count} donation${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
