import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "waitlist-new-subscriber",
  name: "New Subscriber Added",
  description: "Emit new event each time a subscriber is added. [See the documentation](https://getwaitlist.com/docs/api-docs/waitlist)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    waitlistId: {
      propDefinition: [
        common.props.waitlist,
        "waitlistId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getFunction() {
      return this.waitlist.listSignups;
    },
    getProps() {
      return {
        waitlistId: this.waitlistId,
      };
    },
    getSummary(item) {
      return  `New signup with Id: ${item.uuid}`;
    },
    getField() {
      return "created_at";
    },
    getFilter(item, lastValue) {
      let parseDate = item.split("_");
      const itemDate = `${parseDate[0]}T${parseDate[1].replace(/-/g, ":")}`;
      return Date.parse(itemDate) > Date.parse(lastValue);
    },
  },
  sampleEmit,
};
