import common from "../common/base.mjs";

export default {
  ...common,
  key: "planning_center-new-list-result",
  name: "New Person Added to List",
  description: "Emit new event when a person is added to the specified list. [See the documentation](https://developer.planning.center/docs/#/apps/people/2025-03-20/vertices/list_result)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.planningCenter,
        "listId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.planningCenter.getListResult;
    },
    getArgs() {
      return {
        listId: this.listId,
        params: {
          order: "-created_at",
        },
      };
    },
    getSummary(item) {
      return `New List Result with ID: ${item.id}`;
    },
  },
};
