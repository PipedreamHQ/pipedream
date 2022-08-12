import app from "../../sympla.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  name: "New Order",
  description: "Emit new event for each new order in an event.",
  key: "sympla-new-order",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    app,
    eventId: {
      propDefinition: [
        app,
        "eventId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getMeta({
      id,
      buyer_email,
      buyer_first_name,
      buyer_last_name,
    }) {
      return {
        id,
        summary: `${buyer_first_name} ${buyer_last_name} (${buyer_email})`,
        ts: Date.now(),
      };
    },
    async execute() {
      console.log("Starting execution...");
      /*
        The sympla filter just allows to filter per published events.
        In some cases we will repeat some events since a publication can be in the future.
      */
      let page = 1;
      while (true) {
        const res = await this.app.listOrders(
          this.eventId,
          page,
        );

        for (const item of res.data) {
          if (this.isIdExecuted(item.id)) {
            continue;
          }
          this.addExecutedId(item.id);
          this.$emit(item, this.getMeta(item));
        }

        page++;
        if (!res.pagination.has_next) {
          break;
        }
      }
    },
  },
};
