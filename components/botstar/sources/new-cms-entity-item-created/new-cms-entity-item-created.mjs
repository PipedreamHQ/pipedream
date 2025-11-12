import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "botstar-new-cms-entity-item-created",
  name: "New CMS Entity Item Created",
  description: "Emit new event when a new item is created in a CMS entity in BotStar. [See the documentation](https://apis.botstar.com/docs/#/CMS%20Entity%20Items/get_bots__botId__cms_entities__entityId__items)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    botId: {
      propDefinition: [
        common.props.botstar,
        "botId",
      ],
    },
    entityId: {
      propDefinition: [
        common.props.botstar,
        "entityId",
        (c) => ({
          botId: c.botId,
        }),
      ],
    },
  },
  methods: {
    generateMeta(item) {
      return {
        id: item._id,
        summary: `New CMS Entity Item: ${item.name || item.id}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const results = this.botstar.paginate({
      fn: this.botstar.listCmsEntityItems,
      args: {
        botId: this.botId,
        entityId: this.entityId,
      },
    });
    for await (const item of results) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }
  },
  sampleEmit,
};
