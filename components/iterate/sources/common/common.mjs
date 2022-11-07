import iterate from "../../iterate.app.mjs";

export default {
  props: {
    iterate,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: 15 * 60, // 15 minutes
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
