import common from "../common/base-created.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "confluence_data_center-new-blogpost-created",
  name: "New Blogpost Created",
  description: "Emit new event when a new blogpost is created in Confluence Data Center. [See the documentation](https://developer.atlassian.com/server/confluence/rest/v1022/api-group-content-resource/#api-rest-api-content-search-get)",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getContentType() {
      return "blogpost";
    },
  },
  sampleEmit,
};
