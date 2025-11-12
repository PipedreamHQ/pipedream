import common from "../common/polling.mjs";

export default {
  ...common,
  key: "badger_maps-new-check-in-created",
  name: "New Check-In Created",
  description: "Emit new event each time a new check-in is created.",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    accountId: {
      propDefinition: [
        common.props.app,
        "accountId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.listCheckIns;
    },
    getResourceFnArgs() {
      return {
        params: {
          customer_id: this.accountId,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New check-in ${resource.id}`,
        ts: Date.parse(resource.log_datetime),
      };
    },
  },
};
