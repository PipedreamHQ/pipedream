import dribbble from "../dribbble.app.mjs";

export default {
  key: "dribble-new-shot",
  name: "New Shot",
  description: "Emit new events when new shots are created",
  version: "0.0.1",
  type: "source",
  dedupe: "greatest",
  props: {
    dribbble,
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Dribble API",
      default: {
        intervalSeconds: 15 * 60,
      },
    },
  },
  methods: {
    generateMeta(shot) {
      const {
        id,
        title: summary,
        published_at: tsStr,
      } = shot;
      const ts = Date.parse(tsStr);
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run() {
    const shots = await this.dribbble.listShots();
    for (const shot of shots) {
      const meta = this.generateMeta(shot);
      this.$emit(shot, meta);
    }
  },
};
