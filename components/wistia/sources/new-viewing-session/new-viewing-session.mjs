import wistia from "../../wistia.app.mjs";

export default {
  name: "New Viewing Session",
  version: "0.0.1",
  key: "wistia-new-viewing-session",
  description: "Emit new event for each new viewing session.",
  type: "source",
  dedupe: "unique",
  props: {
    wistia,
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New viewing session with id ${data.id}`,
        ts: Date.parse(data.created),
      });
    },
  },
  hooks: {
    async deploy() {
      const medias = await this.wistia.getViewingSessions({
        params: {
          per_page: 10,
        },
      });

      medias.forEach(this.emitEvent);
    },
  },
  async run() {
    let page = 0;

    while (page >= 0) {
      const medias = await this.wistia.getViewingSessions({
        params: {
          page,
          per_page: 100,
        },
      });

      medias.forEach(this.emitEvent);

      if (medias && medias.length < 100) {
        return;
      }

      page++;
    }
  },
};
