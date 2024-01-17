import app from "../../renderform.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "renderform-new-render-result",
  name: "New Render Result",
  description: "Emit new event when a new render result is ready in RenderForm.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(data) {
      this._setLastResourceId(data.identifier);

      this.$emit(data, {
        id: data.identifier,
        summary: `New render result with identifier ${data.identifier}`,
        ts: Date.parse(data.createdAt),
      });
    },
    _setLastResourceId(id) {
      this.db.set("lastResourceId", id);
    },
    _getLastResourceId() {
      return this.db.get("lastResourceId");
    },
  },
  async run() {
    const lastResourceId = this._getLastResourceId();

    let page = 0;

    while (page >= 0) {
      const { content: resources } = await this.app.getRenderResults({
        params: {
          page,
          size: 50,
        },
      });


      resources.reverse().forEach(this.emitEvent);

      if (
        resources.length < 50 ||
        resources.filter((resource) => resource.id === lastResourceId)
      ) {
        return page = -1;
      }

      page++;
    }
  },
};
