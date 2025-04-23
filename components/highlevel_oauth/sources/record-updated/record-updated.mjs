import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "highlevel_oauth-record-updated",
  name: "Record Updated",
  description: "Emit new event when a record is created or updated. [See the documentation](https://highlevel.stoplight.io/docs/integrations/0d0d041fb90fb-search-object-records)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
  },
};
