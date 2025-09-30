import app from "../../roamresearch.app.mjs";

export default {
  key: "roamresearch-search-title",
  name: "Search Title",
  description: "Search for a title in Roam Research pages (access only to non ecrypted graphs). [See the documentation](https://roamresearch.com/#/app/developer-documentation/page/eb8OVhaFC).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    title: {
      type: "string",
      label: "Search Title",
      description: "The title to search for.",
    },
  },
  async run({ $ }) {
    const {
      app,
      title,
    } = this;
    const response = await app.query({
      $,
      data: {
        query: `[
          :find (pull ?b [:block/uid :node/title])
            :in $ ?search-string
            :where [?b :node/title ?page-title] [
              (clojure.string/includes? ?page-title ?search-string)
            ]
        ]`,
        args: [
          title,
        ],
      },
    });

    $.export("$summary", `Successfully searched for title: \`${title}\`.`);
    return response;
  },
};
