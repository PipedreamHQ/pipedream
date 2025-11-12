import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "connecteam-new-shift-schedule",
  name: "New Shift Schedule",
  description: "Emit new event when new shifts are created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    schedulerId: {
      propDefinition: [
        common.props.connecteam,
        "schedulerId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getModelField() {
      return "shifts";
    },
    getModelFieldId() {
      return "id";
    },
    getModelDateField() {
      return "creationTime";
    },
    getParams() {
      const date = new Date();
      return {
        startTime: 1,
        endTime: date.setFullYear(date.getFullYear() + 1000),
      };
    },
    getProps() {
      return {
        schedulerId: this.schedulerId,
      };
    },
    getFunction() {
      return this.connecteam.listShifts;
    },
    getSummary(item) {
      return `New Shift: ${item.title}`;
    },
  },
  sampleEmit,
};
