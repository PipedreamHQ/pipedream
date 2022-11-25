import common from "../common/common-hook.mjs";

export default {
  key: "podio-new-item-created",
  name: "New Item Created",
  description: "Emit new events when a new item is created. [See the docs here](https://developers.podio.com/doc/hooks)",
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
    appId: {
      propDefinition: [
        common.props.app,
        "appId",
        (configuredProps) => ({
          spaceId: configuredProps.spaceId,
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
        summary: `New item created (ID:${event?.body?.item_id})`,
      };
    },
    async getData(event) {
      return this.app.getItem({
        itemId: event?.body?.item_id,
      });
    },
    getEvent() {
      return  "item.create";
    },
    getRefType() {
      return  "app";
    },
    getRefId() {
      return  this.appId;
    },
  },
};
