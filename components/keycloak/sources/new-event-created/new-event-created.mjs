import common from "../common/polling.mjs";

export default {
  ...common,
  key: "keycloak-new-event-created",
  name: "New Event Created",
  description: "Emit new event when a new event is created. [See the documentation](https://www.keycloak.org/docs-api/latest/rest-api/index.html#_realms_admin)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listEvents;
    },
    getResourcesFnArgs() {
      const {
        realm,
        getLastDateFrom,
      } = this;
      return {
        realm,
        params: {
          dateFrom: getLastDateFrom(),
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.time,
        summary: `New Event: ${resource.type}`,
        ts: resource.time,
      };
    },
  },
};
