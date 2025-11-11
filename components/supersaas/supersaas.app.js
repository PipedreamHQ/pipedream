const envConf = require("./common/envConf.js");

module.exports = {
  type: "app",
  app: "supersaas",
  propDefinitions: {
    schedules: {
      type: "string[]",
      label: "Schedules",
      description: "The schedules you'd like to watch for changes",
      async options() {
        return await this.getSchedules();
      },
    },
  },
  methods: {
    async axios(path, opts = {}) {
      const { axios } = await require("@pipedream/platform");

      return await axios(this, {
        url: `${envConf.urlPrefix}${path}`,
        ...opts,
        params: {
          account: this.$auth.account,
          api_key: this.$auth.api_key,
          ...opts.params || {},
        },
      });
    },
    async getSchedules() {
      const xs = await this.axios("/api/schedules.json");
      return xs.map((x) => ({
        value: x.id,
        label: x.name,
      }));
    },
    async createHooks(hookParams) {
      const { axios } = this;

      console.log("Creating hooks:", hookParams);

      return await Promise.all(hookParams.map(
        (x) => axios("/api/hooks", {
          method: "POST",
          params: x,
        }),
      ));
    },
    // TODO: Better error handling. Dylan suggested retries with a backoff
    // algorithm, but that sounds a little overkill to me; but I guess we
    // could at least remember failed hook destructions and retry on every
    // activate/deactivate cycle?
    async destroyHooks(activeHooks) {
      const { axios } = this;

      console.log("Destroying hooks:", activeHooks || []);

      if (!activeHooks || !activeHooks.length) {
        return;
      }

      return await Promise.all(activeHooks.map((x) => axios("/api/hooks", {
        method: "DELETE",
        params: {
          id: x.id,
          parent_id: x.parent_id,
        },
      })));
    },
  },
};
