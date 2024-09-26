import common from "../common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "getresponse-new-landing-page",
  name: "New Landing Page",
  description: "Emit new event when a landing page is created. [See the docs here](https://apireference.getresponse.com/?_ga=2.47520738.499257728.1666974700-2116668472.1666974700&amp;_gl=1*1f3h009*_ga*MjExNjY2ODQ3Mi4xNjY2OTc0NzAw*_ga_EQ6LD9QEJB*MTY2Njk3NzM0Ny4yLjEuMTY2Njk3ODQ3OS4zNi4wLjA.#operation/getLandingPageList)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getLandingPages;
    },
    getResourceFnArgs() {
      return {
        params: {
          [constants.QUERY_PROP.CREATED_ON_FROM]: this.getLastCreatedAt(),
          [constants.SORT_PROP.CREATED_ON]: "DESC",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.landingPageId,
        ts: Date.parse(resource.createdOn),
        summary: `Landing Page ID ${resource.landingPageId}`,
      };
    },
  },
};
