import onepageCrm from "../../onepage_crm.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "onepagecrm-new-deal-closed",
  name: "New Deal Closed",
  description: "Emit new event when a deal is successfully closed in the CRM. [See the documentation](https://developer.onepagecrm.com/api/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    onepageCrm,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    closedDealTriggerSorting: {
      propDefinition: [
        onepageCrm,
        "closedDealTriggerSorting",
      ],
    },
  },
  hooks: {
    async deploy() {
      const deals = await this.onepageCrm.listDeals({
        sort_by: "created_at",
        order: "desc",
        status: "closed",
        per_page: 50,
      });

      // Ensure deals are sorted in descending order by created_at
      deals.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      deals.forEach((deal) => {
        this.$emit(deal, {
          id: deal.id,
          summary: `Deal Closed: ${deal.name}`,
          ts: Date.parse(deal.created_at),
        });
      });
    },
  },
  async run(event) {
    const { body } = event;
    if (body.status === "closed") {
      this.$emit(body, {
        id: body.id,
        summary: `Deal Closed: ${body.name}`,
        ts: Date.parse(body.created_at) || +new Date(),
      });
    }
  },
};
