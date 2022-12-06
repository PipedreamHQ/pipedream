import iterate from "../../iterate.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    iterate,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    surveyId: {
      propDefinition: [
        iterate,
        "surveyId",
      ],
    },
  },
  methods: {
    emitEvent(data) {
      throw new Error("emitEvent is not implemented", data);
    },
    getResources(args = {}) {
      throw new Error("getResources is not implemented", args);
    },
    _setLastResourceId(id) {
      this.db.set("lastResourceId", id);
    },
    _getLastResourceId() {
      return this.db.get("lastResourceId");
    },
  },
  hooks: {
    async deploy() {
      const { resources } = await this.getResources({
        surveyId: this.surveyId,
      });

      resources.slice(10).forEach(this.emitEvent);
    },
  },
  async run() {
    const lastResourceId = this._getLastResourceId();

    let nextUrl;

    do {
      const options = {
        surveyId: this.surveyId,
      };

      if (nextUrl) {
        options.url = nextUrl;
      }

      const {
        next, resources,
      } = await this.getResources(options);

      resources.forEach(this.emitEvent);

      this._setLastResourceId(resources[0].id);

      if (
        resources.length < 100 ||
        resources.filter((resource) => resource.id === lastResourceId).length
      ) {
        return;
      }

      nextUrl = next;
    } while (nextUrl);
  },
};
