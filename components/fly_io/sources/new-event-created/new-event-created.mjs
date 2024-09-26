import common from "../common/polling.mjs";

export default {
  ...common,
  key: "fly_io-new-event-created",
  name: "New Event Created",
  description: "Emit new event when a new event is created in Fly.io. [See the documentation](https://docs.machines.dev/#tag/machines/get/apps/{app_name}/machines/{machine_id}/events)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    appName: {
      propDefinition: [
        common.props.app,
        "appId",
        () => ({
          mapper: ({ name }) => name,
        }),
      ],
    },
    machineId: {
      propDefinition: [
        common.props.app,
        "machineId",
        ({ appName }) => ({
          appName,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listEvents;
    },
    getResourcesFnArgs() {
      const {
        appName,
        machineId,
      } = this;
      return {
        appName,
        machineId,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Event: ${resource.id}`,
        ts: resource.timestamp,
      };
    },
  },
};
