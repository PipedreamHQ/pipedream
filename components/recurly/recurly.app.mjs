import recurly from "recurly";

export default {
  type: "app",
  app: "recurly",
  methods: {
    client() {
      return new recurly.Client(this.$auth.api_key);
    },
    async pagerToPromise(pager) {
      const resources = [];
      for await (const resource of pager.each()) {
        resources.push(resource);
      }
      return resources;
    },
    async makeRequest({
      method, ...args
    } = {}) {
      const pagerOrPromise = this.client()[method](args);

      try {
        if (!pagerOrPromise.then) {
          return this.pagerToPromise(pagerOrPromise);
        }

        return await pagerOrPromise;
      } catch (error) {
        console.log("Error:", error.params, error);
        throw error;
      }
    },
  },
};
