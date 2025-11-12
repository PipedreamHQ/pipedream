import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "botstar-new-cms-entity-created",
  name: "New CMS Entity Created",
  description: "Emit new event when a new CMS entity is created in a BotStar bot. [See the documentation](https://apis.botstar.com/docs/#/CMS%20Entities/get_bots__botId__cms_entities)",
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
  },
  methods: {
    generateMeta(entity) {
      return {
        id: entity.id,
        summary: `New CMS Entity: ${entity.name}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const entities = await this.botstar.listCmsEntities({
      botId: this.botId,
    });
    if (!entities?.length) {
      return;
    }
    for (const entity of entities.reverse()) {
      const meta = this.generateMeta(entity);
      this.$emit(entity, meta);
    }
  },
  sampleEmit,
};
