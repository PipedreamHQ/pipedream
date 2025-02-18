import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  key: "demandbase-new-company-change-instant",
  name: "New Company Change (Instant)",
  description: "Emit new event when a company changes. [See the documentation](https://kb.demandbase.com/hc/en-us/articles/7273680247707--POST-Create-Subscription).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    companyIds: {
      type: "string[]",
      label: "Company IDs",
      description: "List of company IDs.",
      optional: false,
      propDefinition: [
        common.props.app,
        "companyId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getData() {
      return {
        subscriptionType: constants.SUBSCRIPTION_TYPE.COMPANY,
        frecuency: "1day",
        name: "New Company Change",
        companyIds: utils.arrayToCommaSeparatedList(this.companyIds),
      };
    },
    generateMeta(resource) {
      return {
        id: resource.alertId,
        summary: `New Company Change: ${resource.alertId}`,
        ts: Date.parse(resource.date),
      };
    },
  },
};
