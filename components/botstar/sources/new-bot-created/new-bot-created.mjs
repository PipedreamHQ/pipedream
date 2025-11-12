import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "botstar-new-bot-created",
  name: "New Bot Created",
  description: "Emit new event when a new bot is created in BotStar. [See the documentation](https://apis.botstar.com/docs/#/Bots/get_bots_)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    generateMeta(bot) {
      return {
        id: bot.id,
        summary: `New Bot: ${bot.name}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const bots = await this.botstar.listBots();
    for (const bot of bots) {
      const meta = this.generateMeta(bot);
      this.$emit(bot, meta);
    }
  },
  sampleEmit,
};
