import common from "../common/polling.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  key: "leadfeeder-new-lead-created",
  name: "New Lead Created",
  description: "Emit new event when a new lead is created. [See the docs](https://docs.leadfeeder.com/api/#get-leads)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getLeads;
    },
    getResourceFnArgs() {
      const lastVisitDateStr = this.getLastVisitDate();
      const currentDateStr = utils.getFormatDate();
      const daysAgoStr = utils.getFormatDate(30);
      return {
        accountId: this.accountId,
        params: {
          start_date: lastVisitDateStr || daysAgoStr,
          end_date: currentDateStr,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.attributes.first_visit_date) || Date.now(),
        summary: `New Lead Created ${resource.id}`,
      };
    },
  },
};
