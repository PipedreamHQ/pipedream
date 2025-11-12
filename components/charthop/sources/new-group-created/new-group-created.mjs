import common from "../common/base.mjs";

export default {
  ...common,
  key: "charthop-new-group-created",
  name: "New Group Created",
  description: "Emit new event when a new group is added to the organization. [See the documentation](https://api.charthop.com/swagger#/group/findGroups)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    groupTypeId: {
      propDefinition: [
        common.props.charthop,
        "groupTypeId",
        (c) => ({
          orgId: c.orgId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.charthop.listGroups;
    },
    getArgs() {
      return {
        orgId: this.orgId,
        type: this.groupTypeId,
      };
    },
    getSummary(item) {
      return `New Group: ${item.id}`;
    },
  },
};
