import common from "../common/base.mjs";

export default {
  ...common,
  key: "mural-new-area",
  name: "New Area Created",
  description: "Emit new event when a new area is created in the user's mural",
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
          type: "areas",
        },
      };
    },
    getSummary(item) {
      return `New Area Widget ID: ${item.id}`;
    },
  },
};
