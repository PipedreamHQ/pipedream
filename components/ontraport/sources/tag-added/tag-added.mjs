import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "ontraport-tag-added",
  name: "Tag Added (Instant)",
  description: "Emit new event when a tag is added. [See the docs](https://api.ontraport.com/doc/#tag-is-added).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    tagId: {
      propDefinition: [
        common.props.app,
        "tagId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getEventName() {
      return `${events.SUB_TAG}(${this.tagId})`;
    },
    generateMeta(body) {
      const { data } = body;
      return {
        id: data.id,
        summary: `Tag Added ${data.id}`,
        ts: body.timestamp,
      };
    },
  },
};
