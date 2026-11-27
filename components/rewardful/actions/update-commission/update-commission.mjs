import { ConfigurationError } from "@pipedream/platform";
import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-update-commission",
  name: "Update Commission",
  description: "Update when a commission is due or record when it was paid. The commission amount cannot be changed through the API. To mark all of an affiliate's due commissions as paid at once, prefer **Mark Payout as Paid**. Use **List Commissions** to find the commission ID. [See the documentation](https://developers.rewardful.com/rest-api/commissions/update)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rewardful,
    commissionId: {
      propDefinition: [
        rewardful,
        "commissionId",
      ],
    },
    dueAt: {
      type: "string",
      label: "Due At",
      description: "ISO 8601 timestamp when the commission becomes payable to the affiliate, e.g. `2026-11-01T00:00:00Z`. Can be in the past or future.",
      optional: true,
    },
    paidAt: {
      type: "string",
      label: "Paid At",
      description: "ISO 8601 timestamp when the commission was paid, e.g. `2026-10-08T12:00:00Z`. Can be in the past or future.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.dueAt && !this.paidAt) {
      throw new ConfigurationError("Provide at least one of `dueAt` or `paidAt`.");
    }
    const response = await this.rewardful.updateCommission({
      $,
      commissionId: this.commissionId,
      data: {
        due_at: this.dueAt,
        paid_at: this.paidAt,
      },
    });
    $.export("$summary", `Successfully updated commission ${this.commissionId}`);
    return response;
  },
};
