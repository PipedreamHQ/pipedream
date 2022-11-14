import wistia from "../../wistia.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Project",
  version: "0.0.2",
  key: "wistia-new-project",
  description: "Emit new event for each created project.",
  type: "source",
  dedupe: "unique",
  props: {
    wistia,
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New project uploaded with id ${data.id}`,
        ts: Date.parse(data.created),
      });
    },
  },
  hooks: {
    async deploy() {
      const projects = await this.wistia.getProjects({
        params: {
          per_page: 10,
        },
      });

      projects.forEach(this.emitEvent);
    },
  },
  async run() {
    let page = 0;

    while (page >= 0) {
      const projects = await this.wistia.getProjects({
        params: {
          page,
          per_page: 100,
        },
      });

      projects.forEach(this.emitEvent);

      if (projects.length < 100) {
        return;
      }

      page++;
    }
  },
};
