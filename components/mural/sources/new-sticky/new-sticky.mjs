import common from "../common/base.mjs";

export default {
  ...common,
  key: "mural-new-sticky",
  name: "New Sticky Note Created",
  description: "Emit new event each time a new sticky note is created in a specified mural",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    muralId: {
      propDefinition: [
        common.props.mural,
        "muralId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.mural.listWidgets;
    },
    getArgs() {
      return {
        muralId: this.muralId,
        params: {
          type: "sticky notes",
        },
      };
    },
    getSummary(item) {
      return `New Sticky Note ID: ${item.id}`;
    },
  },
};
