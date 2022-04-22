import common from "./common.mjs";
import webflow from "../webflow.app.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    collectionIds: {
      label: "Collections",
      description: "The collections to monitor for item changes",
      type: "string[]",
      optional: true,
      propDefinition: [
        webflow,
        "collections",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    isEventRelevant(event) {
      const { body: { _cid: collectionId } } = event;
      return this.collectionIds.includes(collectionId);
    },
  },
};

