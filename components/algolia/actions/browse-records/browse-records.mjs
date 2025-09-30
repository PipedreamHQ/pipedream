import app from "../../algolia.app.mjs";

export default {
  key: "algolia-browse-records",
  name: "Browse Records",
  description: "Browse for records in the given index. [See the documentation](https://www.algolia.com/doc/libraries/javascript/v5/methods/search/browse/?client=javascript).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    indexName: {
      propDefinition: [
        app,
        "indexName",
      ],
    },
  },
  methods: {
    browse(args) {
      return this.app._client().browse(args);
    },
  },
  async run({ $ }) {
    const {
      browse,
      indexName,
    } = this;

    const response = await browse({
      indexName,
    });

    $.export("$summary", `Successfully fetched records from ${indexName} index.`);

    return response;
  },
};
