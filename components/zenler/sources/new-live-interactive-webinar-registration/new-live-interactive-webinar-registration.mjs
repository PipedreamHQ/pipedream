import common from "../common.mjs";

export default {
  ...common,
  key: "zenler-new-live-interactive-webinar-registration",
  name: "New Live Interactive Webinar Registration",
  description: "Emit new event when a new live interactive webinar is registered. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#1966fea2-8274-49bd-f96d-54c215f9d304)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zenler.getLiveWebinars;
    },
    getResourceFnArgs() {
      return {
        params: {
          order: "desc",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.now(),
        summary: `Live Interactive Webinar ID ${resource.id}`,
      };
    },
  },
};
