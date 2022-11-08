import wistia from "../../wistia.app.mjs";

export default {
  name: "New Video",
  version: "0.0.2",
  key: "wistia-new-video",
  description: "Emit new event for each created video.",
  type: "source",
  dedupe: "unique",
  props: {
    wistia,
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New video uploaded with id ${data.id}`,
        ts: Date.parse(data.created),
      });
    },
  },
  hooks: {
    async deploy() {
      const medias = await this.wistia.getMedias({
        params: {
          type: "Video",
          per_page: 10,
        },
      });

      medias.forEach(this.emitEvent);
    },
  },
  async run() {
    let page = 0;

    while (page >= 0) {
      const medias = await this.wistia.getMedias({
        params: {
          type: "Video",
          page,
          per_page: 100,
        },
      });

      medias.forEach(this.emitEvent);

      if (medias.length < 100) {
        return;
      }

      page++;
    }
  },
};
