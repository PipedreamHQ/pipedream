import common from "../common/webhook.mjs";
import event from "../common/event.mjs";
import model from "../common/model.mjs";
import fields from "../common/bill-fields.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "clio-bill-state-updated-instant",
  name: "Bill State Updated (Instant)",
  description: "Emit new event when the state of a bill has changed in Clio. [See the documentation](https://docs.developers.clio.com/api-reference/#tag/Webhooks/operation/Webhook#index)",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    fields: {
      propDefinition: [
        common.props.app,
        "fields",
      ],
      options: fields,
    },
  },
  methods: {
    ...common.methods,
    setBills(value) {
      this.db.set(constants.BILLS, value);
    },
    getBills() {
      return this.db.get(constants.BILLS) || {};
    },
    getRelevantFields() {
      return [
        "state",
      ];
    },
    getModel() {
      return model.BILL;
    },
    getEvents() {
      return [
        event.UPDATED,
      ];
    },
    isRelevant(body) {
      const resource = body.data;
      const bills = this.getBills();

      if (bills[resource.id] === resource.state) {
        console.log("Bill state is the same, not relevant!");
        return false;
      }

      this.setBills({
        ...bills,
        [resource.id]: resource.state,
      });
      return true;
    },
    generateMeta(body) {
      const resource = body.data;
      const ts = Date.parse(resource.updated_at);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Bill State Updated: ${resource.id}`,
        ts,
      };
    },
  },
};
