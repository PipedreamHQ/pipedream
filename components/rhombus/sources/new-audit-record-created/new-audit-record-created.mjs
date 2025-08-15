import common from "../common/base-polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "rhombus-new-audit-record-created",
  name: "New Audit Record Created",
  description: "Emit new event when a new audit record for a specified event is created. [See the documentation](https://apidocs.rhombus.com/reference/getauditfeed)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    actions: {
      type: "string[]",
      label: "Actions",
      description: "The actions to listen for",
      options: constants.AUDIT_RECORD_ACTIONS,
    },
  },
  methods: {
    ...common.methods,
    getActions() {
      return this.actions;
    },
  },
};
