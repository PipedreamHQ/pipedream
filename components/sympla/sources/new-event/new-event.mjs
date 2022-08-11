import app from "../../sympla.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  name: "New Event",
  description: "Emit new event for each new event created in Sympla.",
  key: "sympla-new-event",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    app,
    published: {
      type: "boolean",
      label: "Only Published Events",
      description: "If `true`, only published events will be emitted.",
      default: true,
    },
  },
  methods: {
    ...common.methods,
    async run() {
      console.log("Starting execution...");
      /*
        The sympla filter just allows to filter per published events.
        In some cases we will repeat some events since a pulication can be in the future.
      */
      let page = 1;
      while (true) {
        const res = await this.app.listEvents(
          page,
          this.getLastExecution(),
          this.published,
        );

        for (const event of res.data) {
          this.$emit(event, this.getMeta(event));
        }

        page++;
        if (!res.pagination.has_next) {
          break;
        }
      }
      this.setLastExecution(new Date());
    },
  },
};

