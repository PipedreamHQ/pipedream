import common from "../common/polling.mjs";

export default {
  ...common,
  key: "precisefp-new-person-created",
  name: "New Person Created",
  description: "Trigger when a new person is created. [See the documentation](https://documenter.getpostman.com/view/6125750/UyrDEFnd#1b841800-dc60-4d1b-9272-7110afd7fe1a)",
  type: "source",
  version: "0.0.1",
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
    hasPagination() {
      return false;
    },
    getResourceName() {
      return "Person";
    },
    getResourceFn() {
      return this.app.listPersons;
    },
    getResourceFnArgs() {
      return {
        accountId: this.accountId,
      };
    },
    generateMeta(resource) {
      return {
        id: resource._id,
        summary: `New Person: ${resource.Email}`,
        ts: Date.now(),
      };
    },
  },
};
