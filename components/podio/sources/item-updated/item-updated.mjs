import common from "../common/common-hook.mjs";

export default {
  key: "podio-item-updated",
  name: "New Item Updated Event",
  description: "Emit new events when an item is updated. [See the docs here](https://developers.podio.com/doc/hooks)",
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
        summary: `Item updated (ID:${event?.body?.item_id})`,
      };
    },
    async getData(event) {
      return this.app.getItem({
        itemId: event?.body?.item_id,
      });
    },
    getEvent() {
      return  "item.update";
    },
    getRefType() {
      return  "app";
    },
    getRefId() {
      return  this.appId;
    },
  },
};
