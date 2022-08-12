import app from "../../sympla.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  name: "New Attendee",
  description: "Emit new event for each new attendee in an event.",
  key: "sympla-new-attendee",
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
      email,
      first_name,
      last_name,
    }) {
      return {
        id,
        summary: `${first_name} ${last_name} (${email})`,
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
        const res = await this.app.listAttendees(
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
      this.setLastExecution(new Date());
    },
  },
};
