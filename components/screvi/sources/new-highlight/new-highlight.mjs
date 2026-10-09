import common from "../common/base.mjs";

export default {
  ...common,
  key: "screvi-new-highlight",
  name: "New Highlight",
  description: "Emit new event when a highlight is saved to your Screvi library. [See the documentation](https://screvi.com/docs/api/public-api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    tag: {
      propDefinition: [
        common.props.screvi,
        "tag",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getParams() {
      return {
        tag: this.tag,
      };
    },
    fetch(opts) {
      return this.screvi.listHighlights(opts);
    },
    getTs(highlight) {
      return highlight.created_at;
    },
    generateMeta(highlight) {
      const source = highlight.source?.name ?? "Screvi";
      return {
        id: highlight.id,
        summary: `New highlight from ${source}`,
        ts: Date.parse(highlight.created_at),
      };
    },
  },
};
