import app from "../../roamresearch.app.mjs";

export default {
  key: "roamresearch-query",
  name: "Query",
  description: "Generic query for Roam Research pages. [See the documentation](https://roamresearch.com/#/app/developer-documentation/page/mdnjFsqoA).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "The query to run in Datalog language. Eg. `[:find ?block-uid ?block-str :in $ ?search-string :where [?b :block/uid ?block-uid] [?b :block/string ?block-str] [(clojure.string/includes? ?block-str ?search-string)]]`.",
    },
    args: {
      type: "string[]",
      label: "Arguments",
      description: "The arguments to pass to the query. Eg. `apple` as the firs argument.",
    },
  },
  async run({ $ }) {
    const {
      app,
      query,
      args,
    } = this;

    const response = await app.query({
      $,
      data: {
        query,
        args,
      },
    });

    $.export("$summary", "Successfully ran query.");
    return response;
  },
};
