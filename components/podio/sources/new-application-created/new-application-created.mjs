import common from "../common/common-hook.mjs";

export default {
  key: "podio-new-application-created",
  name: "New Application Created",
  description: "Emit new events when a new application is created. [See the docs here](https://developers.podio.com/doc/hooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  ...common,
  props: {
    ...common.props,
    orgId: {
      propDefinition: [
        common.props.app,
        "orgId",
      ],
    },
    spaceId: {
      propDefinition: [
        common.props.app,
        "spaceId",
        (configuredProps) => ({
          orgId: configuredProps.orgId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getMeta(event) {
      return {
        id: Date.now(),
        ts: Date.now(),
        summary: `New application created (ID:${event?.body?.app_id})`,
      };
    },
    async getData(event) {
      return this.app.getApp({
        appId: event?.body?.app_id,
      });
    },
    getEvent() {
      return  "app.create";
    },
    getRefType() {
      return  "space";
    },
    getRefId() {
      return  this.spaceId;
    },
  },
};
