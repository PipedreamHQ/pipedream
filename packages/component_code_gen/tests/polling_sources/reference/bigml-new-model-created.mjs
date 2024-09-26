import {
  axios,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "bigml-new-model-created",
  name: "New Model Created",
  description: "Emit new event for every created model. [See docs here.](https://bigml.com/api/models?id=listing-models)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    bigml: {
      type: "app",
      app: "bigml",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      this._setLastDate(new Date());

      console.log("Retrieving historical events...");
      const { objects } = await this.listingFunction().call(this, {
        params: {
          limit: 50,
        },
      });

      for (const object of objects.reverse()) {
        this.emitEvent(object);
      }
    },
  },
  methods: {
    _username() {
      return this.bigml.$auth.username;
    },
    _auth() {
      return this.bigml.$auth.api_key;
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: "https://bigml.io/andromeda" + path,
        params: {
          ...opts.params,
          username: this._username(),
          api_key: this._auth(),
        },
      });
    },
    async paginate({
      fn, ...opts
    }) {
      const results = [];
      const limit = 200;
      let offset = 0;

      while (true) {
        const {
          meta,
          objects,
        } = await fn.call(this, {
          ...opts,
          params: {
            ...opts.params,
            limit,
            offset,
          },
        });

        results.push(...objects);
        offset += limit;

        if (!meta.next) {
          return {
            meta,
            objects: results,
          };
        }
      }
    },
    async listModels({
      paginate = false, ...opts
    } = {}) {
      if (paginate) {
        return this.paginate({
          fn: this.listModels,
          ...opts,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/model",
      });
    },
    _getLastDate() {
      return this.db.get("lastDate");
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate.toISOString().slice(0, -1));
    },
    listingFunction() {
      return this.listModels;
    },
    emitEvent(model) {
      this.$emit(model, {
        id: model.resource,
        summary: `New model created: ${model.name}`,
        ts: model.created,
      });
    },
  },
  async run() {
    let offset = 0;

    while (true) {
      const lastDate = this._getLastDate();
      const currentDate = new Date();

      const { objects } = await this.listingFunction().call(this, {
        paginate: true,
        params: {
          offset,
          limit: 200,
          created__gte: lastDate,
        },
      });

      this._setLastDate(currentDate);
      offset += objects.length;

      if (objects.length === 0) {
        return;
      }

      for (const object of objects) {
        this.emitEvent(object);
      }
    }
  },
};
