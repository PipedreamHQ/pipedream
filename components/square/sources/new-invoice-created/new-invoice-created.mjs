import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "square-new-invoice-created",
  name: "New Invoice Created",
  description: "Emit new event for every new invoice created",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...base.props,
    location: {
      propDefinition: [
        base.props.square,
        "location",
      ],
    },
  },
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log(`Retrieving at most last ${constants.MAX_HISTORICAL_EVENTS} objects...`);
      const response = await this.square.listInvoices({
        paginate: true,
        params: {
          limit: constants.MAX_LIMIT,
          location_id: this.location,
        },
      });
      response?.objects?.slice(-constants.MAX_HISTORICAL_EVENTS)
        .reverse()
        .forEach((object) => this.$emit(object, {
          id: object.id,
          summary: `Invoice created: ${object.id}`,
          ts: object.created_at,
        }));
    },
  },
  methods: {
    ...base.methods,
    getEventTypes() {
      return [
        "invoice.created",
      ];
    },
    getSummary(event) {
      return `Invoice created: ${event.data.id}`;
    },
    getTimestamp(event) {
      return new Date(event.data.object.invoice.created_at);
    },
    isRelevant(event) {
      return event.location_id === this.location;
    },
  },
};
