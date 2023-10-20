import common from "../common/polling.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "leadfeeder-new-recurring-lead",
  name: "New Recurring Lead",
  description: "Emit new event when a lead is recurred. [See the docs](https://docs.leadfeeder.com/api/#get-all-visits-of-a-lead)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    leadId: {
      propDefinition: [
        common.props.app,
        "leadId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getLeadVisits;
    },
    getResourceFnArgs() {
      const lastVisitDateStr = this.getLastVisitDate();
      const currentDateStr = utils.getFormatDate();
      const threeDaysAgoStr = utils.getFormatDate(3);
      return {
        accountId: this.accountId,
        leadId: this.leadId,
        params: {
          start_date: lastVisitDateStr || threeDaysAgoStr,
          end_date: currentDateStr,
        },
      };
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.attributes.last_visit_date) || Date.now();
      return {
        id: ts,
        ts,
        summary: `New Lead Recurred ${resource.id}`,
      };
    },
  },
};
